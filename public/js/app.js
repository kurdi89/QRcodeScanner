jQuery(document).ready(async() => {
    // Socket.io :
    const socket = await io('localhost:5001');

    socket.on('scanned', (data)=>{
        console.log('item scanned :', data)
        var id = data;
        var div = $('#' + id + '.code');
        div.find('.code-image').addClass('scanned');
        div.find('.code-status').removeClass('text-success').addClass('text-danger').text('Used');
    })
    // Fetch ngrok URL from API Route : /link
    async function getLink() {
        const res = await fetch('/link');
        const data = await res.json();
        return data.data
    }
    const url = await getLink()
    await $('#public-url').text(url)
    console.log('url: ', url)

    // options for generating the qr-code :
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        margin: 1,
        color: {
            dark:"#5a5a5a",
            light:"#dcdcdc"
        }
    }

    /** Generating Codes */
    // Send POST to API to add code
    async function generateCode(e) {
        try {
            const res = await fetch('/api/v1/codes', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });
        
            if (res.status === 400) {
                throw Error('Code already exists!');
            }
            // alert('Code added!');
        } catch (err) {
            alert(err);
            return;
        }
    }
    generateCode(); // will generate on a page load

    /**Fetching Codes */
    // Fetch Codes from API
    async function getCodes() {
        const res = await fetch('/api/v1/codes');
        const data = await res.json();
    
        const codes = data.data.map(code => { // not needed unless you modify it
            return {
                code
            };
        });
        return codes
    }
    var codes = await getCodes();
    console.log('codes :', codes)

    /**Delete Codes */
    // Delete Codes from API
    var deleteCodes = async function(e) {
        var id = e;
        console.log('id', e)
        try {
            const res = await fetch('/api/v1/codes', {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({id})
            });
        
            if (res.status === 400) {
                throw Error('Code was not found!');
            }
            // alert('Code deleted!');
            $('#toast').toast('show');
            // remove the div el :
            $('#' + id + '.code').remove();
        } catch (err) {
            alert(err);
            return;
        }
    }

    /**Appending Codes */
    // append codes on the page : 
    await codes.forEach(async code => {
        var scanned, title, status;
        var id = code.code._id;
        var link = url + '/scan/' + id;
        if(code.code.scanned){
            scanned = 'scanned', title = 'used', status = 'text-danger'
        } else {title = 'Active', status = 'text-success'}
        // to String :
        await QRCode.toString(link, opts, function (err, svg) {
            if (err) throw err
            // console.log(svg)
            var img = `<div class="card-img-top code-image ${scanned}">${svg}</div>`
            var div = `
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-2 code" id="${id}">
                <div class="card m-1 mx-auto" style="width: 14rem;">
                    ${img}
                    <div class="card-body">
                    <h6 class="card-title code-status ${status}">${title}</h6>
                    <p class="card-text m-0"><small class="text-muted code-id">${id}</small> <span class="ml-2 delete-code" id="${id}"><small><i class="fa fa-trash"></i></small></small></span></p>
                    </div>
                </div>
            </div>
            `;
            $('#svgs').append(div);
        })
    });
    await $( ".delete-code" ).each(function(index) {
        $(this).on("click", function(){
            // For the mammal value
            var key = $(this).attr('id');
            console.log('key', key)
            deleteCodes(key)
        });
    });

    // handling toasts :
    var options = {
        animation : true,
        autohide : true,
        delay : 1500
    }
    $('.toast').toast(options)


})

