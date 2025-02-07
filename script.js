import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import { getFirestore, collection, doc, getDocs, updateDoc, deleteDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyCaTr2auup8jwxvCPJSqgBdsf_gsIxF7sw",
    authDomain: "project-add-services.firebaseapp.com",
    projectId: "project-add-services",
    storageBucket: "project-add-services.firebasestorage.app",
    messagingSenderId: "977236101788",
    appId: "1:977236101788:web:6ef57d77eb37833782bb59"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

let selectRequest = 'Cilene'
document.getElementById('selectRequest').addEventListener('change', (event) => {
    selectRequest = event.target.value
})

function addServiceList () {
    const money = parseFloat(document.querySelector('#money').value)
    const service = document.querySelector('#serviceInput').value
    const servicesList = document.querySelector('#serviceList')

    const newDivService = newElement(servicesList, 'div', "", 'service', 'media')
    newElement(newDivService, 'span', `R$${money.toFixed(2)} - ${selectRequest}`)
    newElement(newDivService, 'p', service)
    
    const newDivBtnAcoes = newElement(newDivService, 'div', "", 'serviceBtn')
    newElement(newDivBtnAcoes, 'button', '✏️', 'edit')
    newElement(newDivBtnAcoes, 'button', '🗑️', 'delete')
}

async function editDataBase(id, newService) {
    try {
        const serviceData = doc(db, "services", id)
        await updateDoc(serviceData, {
            service: newService
        })
        alert('Serviço atualizado com sucesso!')
    }catch(error) {
        console.log('Erro ao atualizar o serviço:', error)
    }

}

function editFront(serviceElement) {
    const p = serviceElement.querySelector("p")
    const id = serviceElement.getAttribute("data-id")
    const currentService = p.textContent
    const newService = prompt("Edite a descrição do serviço", currentService)

    if(newService !== null) {
        p.textContent = newService.trim()
        editDataBase(id, newService.trim())
    }
}

document.querySelector("#serviceList").addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("edit")) {
        try {
            const serviceElement = event.target.closest('.service')
            editFront(serviceElement)
        }catch (error) {
            console.error("Erro", error)
        }
    }
})

async function deleteDataBase(id) {
    try {
        await deleteDoc(doc(db,"services", id))
    } catch (error) {
        console.error("Erro ao remover o documento do banco de dados:", error)
    }
}

function deleteFront(Service) {
    try {
        Service.remove()
    } catch (error) {
        console.error("Erro ao remover o documento:", error)
    }
}

document.querySelector("#serviceList").addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("delete")) {
        if (confirm('Tem certeza que deseja remover esta linha?')) {
            try {
                const serviceElement = event.target.closest('.service')
                const id = serviceElement.getAttribute("data-id")
        
                deleteFront(serviceElement)
                deleteDataBase(id)
            } catch (error) {
                console.error("Erro ao remover o documento:", error)
            }
        }
        
    }
})

function newElement (local, element, text="", className="", className2="") {
    const newElement = document.createElement(element)
    if (text.trim() !== "") newElement.innerText = text
    if (className.trim() !== "") newElement.classList.add(className)
    if (className2.trim() !== "") newElement.classList.add(className2)
    return local.appendChild(newElement)
}

async function saveDataBase () {
    const money = parseFloat(document.getElementById('money').value)
    const service = document.querySelector('#serviceInput').value

    const data = {
        price: money,
        employer: selectRequest,
        service: service,
        timestamp: new Date()
    }

    try {
        await addDoc(collection(db, "services"), data)
        console.log("Serviço salvo com sucesso!")
        alert("Serviço salvo com sucesso!")
    } catch (error) {
        console.error("Erro ao salvar o serviço:", error)
        }
}

async function loadData () {
    const servicesList = document.querySelector('#serviceList')
    servicesList.innerHTML = ""

    try {
    const querySnapshot = await getDocs(collection(db, "services"))
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const id = doc.id
            
            servicesList.innerHTML += `<div class="service" data-id="${id}">
                                        <span>R$${data.price.toFixed(2)} - ${data.employer}</span>
                                        <p>${data.service}</p>
                                        <div class="serviceBtn">
                                            <button class="edit">✏️</button>
                                            <button class="delete">🗑️</button>
                                        </div>
                                    </div>`
        })
    } catch (error) {
        console.error("Erro ao carregar dados:", error)
    }
}

document.getElementById('addserviceBtn').addEventListener('click', () =>{
    const money = parseFloat(document.getElementById('money').value)
    const service = document.querySelector('#serviceInput').value
    // if (!money || service === '') {
    //     alert('Valor inválido')
    //     return
    // }
    addServiceList()
    saveDataBase()
    document.getElementById('money').value = ''
    document.getElementById('serviceInput').value = ''
})

document.getElementById('money').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const addserviceBtn = document.getElementById('addserviceBtn')
        event.preventDefault()
        addserviceBtn.click()
    }
})

document.addEventListener("DOMContentLoaded", loadData)