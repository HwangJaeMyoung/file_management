// function getChildElementsByClassName(parentElement, className) {
//     var childElements = parentElement.getElementsByClassName(className);
//     return Array.from(childElements);
// }
// function startLongPress(element,event) {
//     pressTimer = setTimeout(function() {
//       console.log("오래 클릭 이벤트 발생!");
//     }, 1000); 
// }
// function endLongPress() {
//     // clearTimeout(pressTimer);
// }
function testament(element){
    var elementRect = element.getBoundingClientRect();
    var elementX = elementRect.left+ elementRect.width / 2;
    var elementY = elementRect.top + elementRect.height / 2;
    var parent = element.parentNode;
    var bubble_number=element.bubble_number
    for (let i = 0; i < bubble_number; i++) {
        setTimeout(() =>{
            //check
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.animationDuration = "4s"
            bubble.style.left = `${(Math.random()-0.5) * elementRect.height  + elementX -20}px`;
            bubble.style.top = `${(Math.random()-0.5)* elementRect.height + elementY-20}px`;

            parent.appendChild(bubble);
            setTimeout(() => {
                bubble.remove();
            },2000+2000*Math.random());
        },1000*Math.random());
    }
}
class MainBubble extends HTMLElement{
    constructor() {
        super();
        this.isuploading = false;
        this.bubble_number=30;
        this.classList.add('create-Animation');
        this.addEventListener("animationend", function(event) {
            if (event.animationName === "createAnimation") {
                this.classList.remove("create-Animation");
                this.classList.add("keep-Animation");
                // this.addEventListener("mousedown",  (event) => {startLongPress(this,event);});
                // this.addEventListener("mouseup", endLongPress);
                // this.addEventListener("mouseleave", endLongPress); 
                // this.addEventListener("touchstart", (event) => {startLongPress(this,event);});
                // this.addEventListener("touchend", endLongPress);
                this.addEventListener("click",(event)=>{
                    event.stopPropagation();
                });
                this.addEventListener("dblclick",(event)=>{
                    event.stopPropagation();
                });
            }
        });
    }
    setting(property){
        const parentWidth=this.parentNode.clientWidth;
        const parentHeight=this.parentNode.clientHeight;
        this.name=property["name"];
        this.id=property["id"];
        this.textContent = `${this.name}#${this.id}`;
        const points=property["points"]

        var left=points[0]*100;
        var top=points[1]*100;
        if (parentWidth<parentHeight){
            this.style.width="20vw";
            this.style.height="20vw";
            this.style.top = "calc("+top.toString() +"vh - 10vw)";
            this.style.left = "calc("+left.toString()+"vw - 10vw)";
        }else{
            this.style.width="20vh";
            this.style.height="20vh";
            this.style.top = "calc("+top.toString() +"vh - 10vh)";
            this.style.left = "calc("+left.toString()+"vw - 10vh)";
        }
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const parentWidth = entry.contentRect.width;
                const parentHeight= entry.contentRect.height;
                if (parentWidth<parentHeight){
                    this.style.width="20vw";
                    this.style.height="20vw";
                }else{
                    this.style.width="20vh";
                    this.style.height="20vh";
                }
            }
        });
        resizeObserver.observe(this.parentNode);

        var isDragging= false;
        this.addEventListener("mousedown", function(e) {
            isDragging = true;
            this.parentNode.addEventListener("mousemove", handleMouseMove);
        });
        var offsetX;
        var offsetY;

        this.addEventListener("touchstart", function(e) {
            isDragging = true;
            const touch = e.touches[0];
            offsetX = touch.clientX - this.getBoundingClientRect().left;
            offsetY = touch.clientY - this.getBoundingClientRect().top;
        });


        const bubble = this;
        function handleMouseMove(e) {
            if (isDragging) {
                const parentWidth = this.clientWidth;
                const parentHeight = this.clientHeight;
                if (parentWidth<parentHeight){
                    bubble.style.left = `calc(${e.clientX}px - 10vw)`;
                    bubble.style.top = `calc(${e.clientY}px - 10vw)`;
                }
                else{
                    bubble.style.left = `calc(${e.clientX}px - 10vh)`;
                    bubble.style.top = `calc(${e.clientY}px - 10vh)`;
                }
                var leftRatio = (bubble.getBoundingClientRect().left - this.getBoundingClientRect().left) / parentWidth;
                var topRatio = (bubble.getBoundingClientRect().top - this.getBoundingClientRect().top) /  parentHeight;
            
                bubble.style.left = `${leftRatio * 100}vw`;
                bubble.style.top = `${topRatio * 100}vh`;
            }
        }
    
        this.parentNode.addEventListener("mouseup", function() {
            if (isDragging) {
                isDragging = false;
                this.removeEventListener("mousemove", handleMouseMove);
            }
        });

        this.parentNode.addEventListener("touchmove", function(e) {
            if (isDragging) {
              const touch = e.touches[0];
              bubble.style.left = `${touch.clientX - offsetX}px`;
              bubble.style.top = `${touch.clientY - offsetY}px`;
            }
        });
        this.parentNode.addEventListener("touchend", function() {
            isDragging = false;
        });
    }
    remove() {
        this.classList.remove("keep-Animation");
        this.classList.add("fade-Animation");
        setTimeout(() => {
        super.remove();
        },1000);
        testament(this);
    }
}

function removeLastPath(path) {
    const lastIndex = path.lastIndexOf('/');
    if (lastIndex !== -1) {
        return path.slice(0, lastIndex);
    } else {
        return path;
    }
}


class TerminalBubble extends MainBubble{
    constructor(){
        super();
        this.classList.add('bubble-terminal');
        this.addEventListener("dblclick",(event)=>{
            event.stopPropagation();
            if (!this.isuploading){
                this.parentNode.id = this.id;
                this.parentNode.load();
            }
        });
    }
}
class LeafBubble extends MainBubble{
    constructor(){
        super();
        this.classList.add('bubble-leaf');
        this.addEventListener("dblclick",(event)=>{
            if (!this.isuploading){
                this.download(event);
            }
        });
    }
    download(event){
        const fileUrl = `download?bubble_id=${this.id}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.target = '_blank'; // 새 탭에서 열기
        downloadLink.click();
    }
}
class MenuBubble extends HTMLElement{
    static count=0;
    static menu_list=["home","refresh","leaf","terminal","parent"];
    constructor() {
        super();
        this.bubble_number=3;     
        this.count=MenuBubble.count;
        this.classList.add('bubble-menu');
        this.classList.add(`orbit-Animation-${this.count}`);
        MenuBubble.count++;
        this.classList.add(`${MenuBubble.menu_list[this.count]}-icon`);
        this.addEventListener("dblclick",(event)=>{
            event.stopPropagation();
        });
    }
    static createMenuBubbles(element,event,type){
        MenuBubble.count=0;
        MenuBubble.menu_list.forEach(menu=>{
            const bubble=new MenuBubble();
            const clickX = event.clientX -20;
            const clickY = event.clientY -20;
            bubble.style.left = clickX + 'px';
            bubble.style.top = clickY + 'px';
            const angle = (2 * Math.PI * bubble.count) / 5; 
            const y = parseFloat((Math.cos(angle)).toFixed(2));
            const x = parseFloat((Math.sin(angle)).toFixed(2));
            bubble.addEventListener("animationend", function(event) {
                if (event.animationName === `orbitAnimation${bubble.count}`) {
                    bubble.classList.remove(`orbit-Animation-${bubble.count}`);
                    bubble.classList.add("keep-Animation");
                    bubble.style.left=`${clickX-40*x}` + 'px';
                    bubble.style.top = `${clickY-40*y}` + 'px';
                    bubble.addEventListener("click", (event)=> {
                        event.stopPropagation();
                        bubble.remove();
                        setTimeout(() => {
                            const bubble_list =element.querySelectorAll("bubble-menu");
                            bubble_list.forEach(bubble=>{
                                bubble.remove();
                            })
                        }, 1000);
                    });
                }
            });

            switch (menu) {
                case "home":
                    bubble.addEventListener("click",()=>{   
                        get_home()
                        .then((home)=>{element.id=home;element.load();})
                        .catch((error)=>{})
                        });
                    break;
                case "refresh":
                    bubble.addEventListener("click",()=>{element.load();});
                    break;
                case "leaf":
                    const fileInput = document.getElementById('fileInput');
                    function fileInputevent(e){
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                            console.log('선택한 파일:', selectedFile);
                            console.log(selectedFile.name);
                            const seabedRect= element.getBoundingClientRect();
                            console.log(event.clientX,seabedRect.height);
                            const property = {"name":selectedFile.name,"id":null,"points":[event.clientX/seabedRect.width,event.clientY/seabedRect.height],"isTerminal":false};
                            const bubble = element.createMainBubble(property);
                            upload(selectedFile,element.id,selectedFile.name,bubble);
                            this.removeEventListener('change',fileInputevent);
                        }
                    }
                    bubble.addEventListener("click",()=>{
                        fileInput.value = null;
                        fileInput.addEventListener('change', fileInputevent);
                        fileInput.click();
                    });

                    break;
                case "terminal":
                    bubble.addEventListener("click",(e)=>{
                        const inputElement = document.createElement('input');
                        inputElement.setAttribute('type', 'text');
                        element.appendChild(inputElement);
                        console.log(inputElement.offsetWidth);
                        inputElement.style.top="10vh";
                        inputElement.style.left=`calc(50vw - ${inputElement.offsetWidth/2}px)`;
                        inputElement.style.textAlign = 'center';
                        inputElement.focus();
                        inputElement.addEventListener('keyup', (e) => {
                            if ((e.key === 'Enter' )||(e.keycode === 13 )) {
                                console.log('Enter 키가 눌렸습니다:', inputElement.value);
                                const seabedRect= element.getBoundingClientRect();
                                const property = {"name":inputElement.value,"id":null,"points":[event.clientX/seabedRect.width,event.clientY/seabedRect.height],"isTerminal":true};
                                const bubble= element.createMainBubble(property);
                                upload(null,element.id,inputElement.value,bubble);
                                inputElement.blur()
                            }
                    
                        });
                        inputElement.addEventListener('blur', () => {
                            console.log('커서가 벗어났습니다:', inputElement.value);
                            inputElement.remove();
                        });
                    });    
                    break;
                case "parent":
                    bubble.addEventListener("click",()=>{
                        get_parent(element.id)
                        .then((bubble_id) => {
                            console.log(bubble_id);
                            element.id=bubble_id; 
                            element.load();
                        })
                        .catch((error) => {
                            // console.error(error);
                            element.load();
                        });
                    }); 
                    break;
                default:
                    break;
            }

            setTimeout(() => {
                element.appendChild(bubble);

            }, bubble.count*100);
        });
    }
    remove() {
        this.classList.remove("keep-Animation");
        this.classList.add("fade-Animation");
        setTimeout(() => {
        super.remove();
      },1000);
      testament(this);
    }
}

function upload(file,id,name,bubble){
    if (bubble != null){
        bubble.isuploading=true;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    if(file !=null){
        formData.append('flag',"leaf");
        formData.append('file', file);
        formData.append('name', file.name);
    }
    else{
        formData.append('flag',"terminal");
        formData.append("name",name);
    }
    formData.append('id', id);
    
    xhr.open('POST', 'upload', true);
    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            if (bubble != null){
                bubble.textContent=percent.toFixed(2) + '%';
                if ((e.loaded / e.total).toFixed(2)>0.5){
                    bubble.style.opacity = `${(e.loaded / e.total).toFixed(2)}`;
                }else{
                    bubble.style.opacity =0.5;
                }
                
            }
            else{
                console.log("bubble is null");
            }
        }
    };
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            
            console.log('파일 업로드 성공:', xhr.responseText);
            if (bubble != null){
                const jsonResponse = JSON.parse(xhr.responseText);
                bubble.id= jsonResponse["id"];
                bubble.textContent=`${bubble.name}#${bubble.id}`;
                bubble.isuploading=false;
            }

        }
    };
    xhr.send(formData);
}

// function traverseDirectory(directoryEntry,path){
//     const directoryReader = directoryEntry.createReader();
//     function readEntries() {
//         directoryReader.readEntries(function(entries) {
//             if (entries.length > 0) {
//                 for (let i = 0; i < entries.length; i++) {
//                     const entry = entries[i];
//                     const entry_path = `${path}/${entry.name}`;
//                     if (entry.isFile) {
//                         entry.file(file=>{
//                             upload(file,entry_path);
//                         })
//                         console.log('파일:', entry.name);
//                     } else if (entry.isDirectory) {
//                         console.log('하위 디렉토리:', entry.name);
//                         upload(null,entry_path);
//                         traverseDirectory(entry,entry_path);
//                     }
//                 }
//                 readEntries();
//             }
//         });
//     }
//     readEntries();
// }

function uploadEvent(event){
    event.preventDefault();
    const items = event.dataTransfer.items;
    const seabed = this;
    const seabedRect = seabed.getBoundingClientRect();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            const path= `${Seabed.path}/${entry.name}`;
            if (entry.isFile){
                entry.file(file=>{
                    console.log(event);
                    property={"name":entry.name,"id":null,"points":[event.clientX/seabedRect.width,event.clientY/seabedRect.height],"isTerminal":false};
                    const bubble=seabed.createMainBubble(property);
                    upload(file,seabed.id,entry.name,bubble);
                })
            }else if(entry.isDirectory){
                property={"name":entry.name,"id":null,"points":[event.clientX/seabedRect.width,event.clientY/seabedRect.height],"isTerminal":true};
                const bubble=seabed.createMainBubble(property);
                upload(null,seabed.id,entry.name,bubble);
                // traverseDirectory(entry,path);
            }
        }
    }
}

class Seabed extends HTMLElement {
    static path;
    constructor() {
        super();
        this.id;
        this.classList.add("deep-seabed");
        this.addEventListener("dblclick",(event)=>{
            event.stopPropagation();
            MenuBubble.createMenuBubbles(this,event,"center");
        });
        this.addEventListener("click", (event) =>{
            event.stopPropagation();
            const bubble = document.createElement('div');
            bubble.classList.add('bubble-blank');
            const clickX = event.clientX - 20;
            const clickY = event.clientY - 20;
            bubble.classList.add("spread-Animation");
            bubble.style.left = clickX + 'px';
            bubble.style.top = clickY + 'px';
            this.appendChild(bubble);
            setTimeout(() => {
                bubble.remove()
            }, 1000);
            this.querySelectorAll('bubble-menu').forEach(bubble=>{
                bubble.remove();
            });
        });
        this.addEventListener('touchmove', function(event) {event.preventDefault();});
        this.addEventListener('dragover', function(event) {event.preventDefault();});
        this.addEventListener('dragleave', function(event) {event.preventDefault();});
        this.addEventListener('drop',uploadEvent);
        
    }
    createMainBubble(property){
        if (property["isTerminal"]){
            const bubble= new TerminalBubble();
            this.appendChild(bubble);
            bubble.setting(property);
            return bubble;
        }else{
            const bubble =new LeafBubble();
            this.appendChild(bubble);
            bubble.setting(property);
            return bubble;
        }
    }
    createMainBubbles(bubble_list){
        bubble_list.forEach(property => {
            this.createMainBubble(property)});
    }
    load(){
        console.log(this.id);
        this.querySelectorAll('bubble-menu').forEach(bubble=>{bubble.remove()});
        this.querySelectorAll('bubble-leaf').forEach(bubble=>{bubble.remove()});
        this.querySelectorAll('bubble-terminal').forEach(bubble=>{bubble.remove()});
        get_bubble_list(this.id)
        .then((bubble_list) => {this.createMainBubbles(bubble_list);})
        .catch((error) => {console.error(error);});
    }

}

function get_parent(id) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('bubble_id',id);
        xhr.open('POST', 'get_parent', true);
        xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                const result = jsonResponse["result"];
                if (result==true){
                    const bubble_id = jsonResponse["bubble_id"];
                    console.log(`bubble_id:${bubble_id}`);
                    resolve(bubble_id);
                } else{
                    reject(new Error('불러 오기 실패 오류'));
                }
            } else {
                reject(new Error('응답 상태 오류'));
            }
        }
      };
      xhr.send(formData);
    });
}

function get_home(){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();        
        xhr.open('GET', 'get_home', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4){
                if(xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                const home= jsonResponse["home"];
                console.log(home);
                resolve(home);
                }else{
                    reject(new Error('불러 오기 실패 오류'));
                }
            }
        };
        xhr.send(formData);
    });
}
function get_bubble_list(id) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('bubble_id',id);
        xhr.open('POST', 'get_child', true);
        xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                const result = jsonResponse["result"];
                if (result==true){
                    const bubble_list = jsonResponse["bubble_list"];
                    console.log(bubble_list);
                    resolve(bubble_list);
                } else{
                    reject(new Error('불러 오기 실패 오류'));
                }
            } else {
                reject(new Error('응답 상태 오류'));
            }
        }
      };
      xhr.send(formData);
    });
}
customElements.define('deep-seabed', Seabed);
customElements.define('bubble-main', MainBubble);
customElements.define('bubble-terminal', TerminalBubble);
customElements.define('bubble-leaf', LeafBubble);
customElements.define('bubble-menu', MenuBubble);


document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById("body");
    const seabed = new Seabed();
    body.appendChild(seabed);
    get_home()
    .then((home) => {seabed.id=home; seabed.load();})
    .catch((error) => {console.error(error);});
    const newDiv = document.createElement('div');

    // id 속성 설정
    newDiv.id = 'floatingObject';

    // 스타일링 추가
    newDiv.style.width = '100vw';
    newDiv.style.height = '200px';

    newDiv.style.position = 'fixed';
    newDiv.style.top = '-200px'; // 초기에는 화면 위쪽 바깥으로 숨김
    newDiv.style.transition = 'top 0.5s ease'; // 부드럽게 이동하는 효과 추가

    // 동적으로 생성한 <div> 요소를 문서에 추가
    seabed.appendChild(newDiv);
    

    seabed.addEventListener('mousemove', (event) => {
        const mouseY = event.clientY;
        if (mouseY < 150) { // 마우스가 화면 위쪽 100px 이내로 들어왔을 때
          floatingObject.style.top = '0px'; // 오브젝트를 내려옴
        } else {
          floatingObject.style.top = '-200px'; // 오브젝트를 다시 숨김
        }
    });
});
