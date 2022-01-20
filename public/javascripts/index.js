window.addEventListener("load", (event)=>{
    let arrOfDeleteButtons = document.getElementsByClassName("delete-btn");
    let arrOfEditButtons = document.getElementsByClassName("edit-btn");

    for(let i = 0 ; i < arrOfDeleteButtons.length; i++){
        arrOfDeleteButtons[i].addEventListener("click",async (e)=> {
            e.preventDefault();
            let questionId = findQuestionId(e)
            let url = window.location.origin+ '/'
            await fetch(`${url}questions/${questionId}`,{
                method: 'delete'
            });
            let container = document.getElementById(containerId);
            container.remove();
        })
    }
    for(const currEditButton of arrOfEditButtons){
        currEditButton.addEventListener("click",async(e)=>{
        let questionId = findQuestionId(e);
        let content = document.getElementById(`content-${questionId}`);
        let textContentOriginal = content.textContent;
        toggleClassAndEditable(content);
            addEventListenerCancel(e,questionId,textContentOriginal,content);
            addEventListenerConfirm(e,questionId,content);
            toggleEdits(questionId);
        })
    }
    function findQuestionId(e){
        let containerId = e.path[1].id;
        let arr = containerId.split("-");
        let questionId = arr[arr.length-1];
        return questionId;
    }
    function toggleClassAndEditable(content){
        content.toggleAttribute("contenteditable")
        content.classList.toggle("editable")
    }

    function addEventListenerConfirm(originalEvent,questionId,content){
        let currConfirmEditButton = document.getElementById(`confirm-edit-${questionId}`);
        currConfirmEditButton.addEventListener('click',async(e)=>{
            let questionId = findQuestionId(e);
            let url = getURL() + '/';
            let newText = content.textContent;
            toggleEdits(questionId);
            toggleClassAndEditable(content);
            await fetch(`${url}questions/${questionId}`,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({content:newText})
            });
            window.location.href = window.location;
        })
    }
    function addEventListenerCancel(originalEvent,questionId,originalText,originalContent){
        let currCancelEditButton = document.getElementById(`cancel-edit-${questionId}`);
        currCancelEditButton.addEventListener('click',async(e)=>{
            originalContent.textContent = originalText;
            toggleClassAndEditable(originalContent);
            toggleEdits(questionId);
            //for some reason it wont toggle again so just reloading page to avoid this
            window.location.href = window.location
        })
    }

    function toggleEdits(questionId){
        document.getElementById(`${questionId}-edit`).toggleAttribute("hidden");
        document.getElementById(`cancel-edit-${questionId}`).toggleAttribute("hidden");
        document.getElementById(`confirm-edit-${questionId}`).toggleAttribute("hidden");
    }
    function getURL(){
        var url = window.location;
        return url.origin
    }
})
