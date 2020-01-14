jQuery(document).ready(async() => {
    // Socket.io :
    const socket = await io('localhost:5001');

    socket.on('scanned', (data)=>{
        console.log('item scanned :', data)
        var id = data;
        $('#msg').text(id + ' was scanned, you should see a live feedback on your screen')
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
})

