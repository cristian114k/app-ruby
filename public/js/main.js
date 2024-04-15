let dataTable;
let dataTableIsInitialized=false;

let dataTableOptions = {
    pageLength: 3,
    destroy: true,
    columnDefs: [{className: "centered", targets: "_all"}]
}

const initDataTable=async()=>{
    if(dataTableIsInitialized){
        dataTable.destroy();
    }

    await listFeatures();

    dataTable=$("#dataTable").DataTable(dataTableOptions);
    dataTableIsInitialized=true;
}

function setValueToInput(value) {
    var input = document.getElementById("idFeature");
    input.value = value;
    let modalBtn = document.getElementById('modal-btn');
    modalBtn.innerHTML = `<button type="button" class="btn btn-primary" onclick="postComment(${value})">Save</button>`;
}

const listFeatures=async()=>{
    try {
        const response = await fetch('/api/features');
        const  responseData = await response.json();
        const features = responseData.data;

        let content = ``;
        let tsunami ='';

        features.forEach((feature,index) => {
            if (feature.attributes.tsunami){
                tsunami ='<i class="fa fa-check" aria-hidden="true" style="color:green"></i>'
            }
            else{
                tsunami ='<i class="fa fa-times" aria-hidden="true" style="color:red"></i>'
            }
            content+=`
            <tr>
                <td>${feature.id}</td>
                <td>${feature.attributes.magnitude}</td>
                <td>${feature.attributes.place}</td>
                <td>${feature.attributes.time}</td>
                <td>${tsunami}</td>
                <td>${feature.attributes.mag_type}</td>
                <td>${feature.attributes.title}</td>
                <td>${feature.attributes.coordinates.longitude}</td>
                <td>${feature.attributes.coordinates.latitude}</td>
                <td><a href="${feature.links.external_url}" target="_blank"><button type="button" class="btn btn-info"><i class="fa fa-external-link" aria-hidden="true"></i></button></a></td>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#CommentsModal" onclick="setValueToInput(${feature.id})"><i class="fa fa-plus" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#CommentsModal" onclick="listComments(${feature.id})"><i class="fa fa-eye" aria-hidden="true" style="color:white"></i></button>
                    </div>
                </td>
            </tr>`;
        });
        tableBody_features.innerHTML = content;
    } catch (error) {
        alert(error)
    }
}

const setComments=async(id)=>{
    await listComments(id);   
}


const listComments = async (id) => {
    const divElement = document.getElementById('commentContent');
    divElement.innerHTML = ""

    try {
        const response = await fetch(`/api/features/${id}/comments`);
        const responseData = await response.json();
        const comments = responseData.data;

        if (typeof responseData.data === 'undefined') {
            const noCommentContent = document.getElementById('commentContent');
            noCommentContent.innerHTML = responseData.message;
        }
        else{
            var contenedor = document.getElementById('commentContent');
            var ul = document.createElement('ul');
            ul.classList.add('list-group');
            ul.id = 'comments';

            comments.forEach((comment, index) => {
                var li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = comment.attributes.body;
                ul.appendChild(li);
            });

            contenedor.appendChild(ul);
        }
    } catch (error) {
        alert(error);
        console.log(error);
    }
}

const postComment = async (id) => {
    const textarea = document.getElementById('message-text');
    const message = textarea.value.trim();

    console.log(JSON.stringify(message));

    try {
      const response = await fetch(`/api/features/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: message })
      });
      
      if (!response.ok) {
        throw new Error('Error sending the request POST');
      }
      
      const responseData = await response.json();
      console.log('Server response:', responseData);
      $('#CommentsModal').modal('hide'); 

    } catch (error) {
        alert("Comment unsaved")
        console.error('Error:', error);
    }
  };

window.addEventListener("load", async() =>{
    await initDataTable();
})