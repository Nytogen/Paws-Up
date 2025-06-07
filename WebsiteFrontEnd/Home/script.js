const button = document.getElementById('IncrementButt')
const counter = document.getElementById('Counter')

document.addEventListener('DOMContentLoaded', () => {

    let request = new XMLHttpRequest()
    request.open('GET', 'http://127.0.0.1:8000/api/Home/', true)

    request.onload = () => {
        let result = JSON.parse(request.responseText)

        if (result.length == 0){
            counter.textContent = "No Objects in Database"

            let poster = new XMLHttpRequest()

            poster.open('POST', 'http://127.0.0.1:8000/api/Home/', true)
            poster.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

            poster.onreadystatechange = () => {

                if(poster.readyState === 4 && (poster.status === 201 || poster.status === 204)){
                    let object = JSON.parse(poster.response)
                    console.log(object)
                }
            }

            let body = JSON.stringify({name: "pineapples", count: 0})
            poster.send(body)

            counter.textContent = "pineapple Counter: 0" 

        } else {
            counter.textContent = result[0].name + " Counter: " + result[0].count
        }
    }

    request.send()
})

button.onclick = () => {

    let request = new XMLHttpRequest()
    request.open('GET', 'http://127.0.0.1:8000/api/Home/', true)

    request.onload = () => {

        let result = JSON.parse(request.responseText)
        let url = 'http://127.0.0.1:8000/api/Home/' + result[0].id + '/'
        
        let putter = new XMLHttpRequest()

        putter.open('PUT', url, true)
        putter.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

        putter.onreadystatechange = () => {

            if(putter.readyState === 4 && (putter.status === 201 || putter.status === 204)){
                let object = JSON.parse(putter.response)
                console.log(object)
            }
        }

        let body = JSON.stringify({id: result[0].id, name: result[0].name, count: result[0].count + 1})
        putter.send(body)

    }

    request.send()
}