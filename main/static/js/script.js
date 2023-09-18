function getExpansion(filename) {
    const lastIndex = filename.lastIndexOf('.');
    if (lastIndex !== -1) {
        return filename.slice(lastIndex+1);
    } else {
        return filename;
    }
}

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

class Bubble extends HTMLElement{
    constructor(){
        super();
        this.flagStopPropagation = true;
        this.flagCreateAnimation = true;
        this.flagMoveAnimaion = true;
        this.flagMainMenuRemoveAnimaion = true;
        this.flagKeepAnimation=true;
        this.flagEditable = true;
    }
    setting(){
        this.setStopPropagation();
        this.setCreateAnimation();
        this.setMoveAnimation();
        this.setMainMenuRemoveAnimation();
    }
    setStopPropagation(){
        if (this.flagStopPropagation){
            this.addEventListener("click",(event)=>{
                event.stopPropagation();
            });
            this.addEventListener("dblclick",(event)=>{
                event.stopPropagation();
            });
        }
    }
    setCreateAnimation(){
        if(this.flagCreateAnimation){
            this.classList.add('create-Animation');
            if(this.flagKeepAnimation){
                this.addEventListener("animationend", function(event) {
                    if (event.animationName === "createAnimation") {
                        this.classList.remove("create-Animation");
                        this.classList.add("keep-Animation");
                    }
                });
            }
        }
    }
    setMoveAnimation(){
        if(this.flagMoveAnimaion){
            this.addEventListener("mousedown", function(e) {
                this.parentNode.selectedBubble =  this;
                this.parentNode.addEventListener("mousemove", handleMouseMove);
            });
            var offsetX;
            var offsetY;
            this.addEventListener("touchstart", function(e) {
                this.parentNode.selectedBubble =  this;
                const touch = e.touches[0];
                offsetX = touch.clientX - this.getBoundingClientRect().left;
                offsetY = touch.clientY - this.getBoundingClientRect().top;
            });
            this.parentNode.addEventListener("touchmove", function(e) {
                if (this.selectedBubble !=null) {
                  const touch = e.touches[0];
                  this.selectedBubble.style.left = `${touch.clientX - offsetX}px`;
                  this.selectedBubble.style.top = `${touch.clientY - offsetY}px`;   
                }
            });
            function handleMouseMove(e) {
                if (this.selectedBubble != null) {
                    this.selectedBubble.style.left = `calc(${e.clientX}px - calc(0.5 * ${this.selectedBubble.style.width}))`;
                    var leftRatio = (this.selectedBubble.getBoundingClientRect().left - this.getBoundingClientRect().left) / this.clientWidth;
                    this.selectedBubble.style.left = `${leftRatio * 100}vw`;

                    this.selectedBubble.style.top = `calc(${e.clientY}px - calc(0.5 * ${this.selectedBubble.style.height}))`;
                    var topRatio = (this.selectedBubble.getBoundingClientRect().top - this.getBoundingClientRect().top) /  this.clientHeight;
                    this.selectedBubble.style.top = `${topRatio * 100}vh`;                    
                }
            }
            if (this.parentNode.check_bubble_move_listener ==null){
                this.parentNode.check_bubble_move_listener = true;
                this.parentNode.addEventListener("mouseup", function(e) {
                    if (this.selectedBubble !=null) {
                        this.removeEventListener("mousemove", handleMouseMove);
                        this.selectedBubble = null;
                    }
                });
                this.parentNode.addEventListener("touchend", function(e) {         
                    if(this.selectedBubble !=null){
                        this.selectedBubble = null;
                    }
                });
            }
        }
    }
    setMainMenuRemoveAnimation(){
        if(this.flagMainMenuRemoveAnimaion){
            this.addEventListener("click",()=>{
                this.parentNode.querySelectorAll(':scope > bubble-menu').forEach(bubble=>{
                    bubble.remove();
                });
            })
        }
    }
    connectedCallback() {
        this.setting();
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

class MainBubble extends Bubble{
    constructor(property){
        super();
        this.isuploading = false;
        this.bubble_number=10;
        this.style.width= "20vmin";
        this.style.height= "20vmin";

        this.flagDblClickEvent = true;
        this.flagRightClickEvent=true;
        this.property= property;
        
        this.menuManager = new MenuManager(this);


    }
    setting(){
        super.setting();
        this.setProperty();
        this.setDblClickEvent();
        this.setRightClickEvent();
    }
    setProperty(){
        this.name=this.property["name"];
        this.id=this.property["id"];
        this.textContent = `${this.name}#${this.id}`;
        const points=this.property["points"];
        var left=points[0]*100;
        var top=points[1]*100;
        this.style.top = `calc(${top}vh - calc(0.5 * ${this.style.height}))`;
        this.style.left = `calc(${left}vw - calc(0.5 * ${this.style.width}))`;
    }
    setDblClickEvent(){}
    setRightClickEvent(){}
    delete(){
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        console.log(this.flag);
        formData.append('method', "DELETE");
        formData.append('flag', this.flag);
        formData.append('id', this.id);
        xhr.open('POST', 'bubble', true);
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // console.log('파일 삭제 성공:', xhr.responseText);
                const jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse["message"] == "success"){
                    this.remove();
                }
                else{
                    alert(jsonResponse["message"]);
                }
            }
        };
        xhr.send(formData);
    }
    refresh(){}

    rename(){}

}

class TerminalBubble extends MainBubble{
    constructor(property){
        super(property);
        this.classList.add('bubble-terminal');
        this.flag= "terminal";
    }
    setRightClickEvent(){
        if(this.flagRightClickEvent){
            this.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                if(this.flagEditable){
                    this.flagEditable = false;
                    const bubble= new TerminalExpBubble(this);
                    this.parentNode.appendChild(bubble);
                }
            });
        }

    }
    setDblClickEvent(){
        if(this.flagDblClickEvent){
            this.addEventListener("dblclick",(event)=>{
                event.stopPropagation();
                if (!this.isuploading){
                    this.parentNode.id = this.id;
                    this.parentNode.load();
                }
            });
        }
    }
}
class LeafBubble extends MainBubble{
    
    constructor(property){
        super(property);
        this.classList.add('bubble-leaf');
        this.flag= "leaf";
    }
    setDblClickEvent(){
        this.addEventListener("dblclick",(event)=>{
            if (!this.isuploading){
                var exp = getExpansion(this.name)
                switch (exp) {
                    case "jpg":
                    case "png":
                    case "PNG":
                        if(this.flagEditable){
                            this.flagEditable = false;
                            const bubble= new ImageBubble(this);
                            this.parentNode.appendChild(bubble);
                        }
                        break;
                    case "txt":
                        if(this.flagEditable){
                            this.flagEditable = false;
                            const bubble= new TxtBubble(this);
                            this.parentNode.appendChild(bubble);
                        }
                        break;

                    default:
                        this.download()
                        break;
                }
                

            }
        });
    }
    download(){
        const fileUrl = `bubble/download?id=${this.id}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.target = '_blank'; // 새 탭에서 열기
        downloadLink.click();
    }
}

class MenuManager{
    static menu_list=[["home","refresh","leaf","terminal","parent"],["turn_off","download","copy","delete"],["turn_off","download","copy","delete","save"]];
    static animation_List = [["orbitAnimation0","orbitAnimation1","orbitAnimation2","orbitAnimation3","orbitAnimation4"],[],[]]
    static animation_class_List=[["orbit-Animation-0","orbit-Animation-1","orbit-Animation-2","orbit-Animation-3","orbit-Animation-4"],[],[]]
    constructor(element){
        this.element=element;
    }
    create(points,type=0){
        const group = new MenuGroup();
        MenuManager.menu_list[type].forEach(menu=>{
            const bubble = new MenuBubble(menu);
            group.append(bubble);
        })

        switch (type) {
            case 0:
                group.points= [points[0] -20,points[1] -20];
                group.group.forEach(bubble=>{
                    bubble.bubble_number=2;     
                    bubble.addEventListener("click", (event)=> {
                        bubble.remove();
                        setTimeout(() => {
                            group.remove();
                        }, 1000);
                    });
                    bubble.style.left = group.points[0] + 'px';
                    bubble.style.top = group.points[1] + 'px';
                    const index = group.group.indexOf(bubble);
                    const angle = (2 * Math.PI * index) / 5;
                    const y = parseFloat((Math.cos(angle)).toFixed(2));
                    const x = parseFloat((Math.sin(angle)).toFixed(2));
                    bubble.classList.add(MenuManager.animation_class_List[type][index]);
                    bubble.addEventListener("animationend", (event)=>{
                        if (event.animationName === MenuManager.animation_List[type][index]) {
                            bubble.classList.remove(MenuManager.animation_class_List[type][index]);
                            bubble.classList.add("keep-Animation");
                            bubble.style.left=`${group.points[0]-40*x}` + 'px';
                            bubble.style.top = `${group.points[1]-40*y}` + 'px';
                        }
                    });
                    setTimeout(() => {
                        this.element.appendChild(bubble);
                    }, index*100);
                })
                break;
            case 1:
                group.group.forEach(bubble=>{
                    bubble.bubble_number=0;
                    bubble.style.position ="absolute";
                    this.element.appendChild(bubble);
                });

                group.group[0].style.left="calc(50% - 42px + 15vmin)";
                group.group[0].style.top="2vmin";
                group.group[0].style.zIndex="996";

                group.group[1].style.left="calc(50% - 22px)";
                group.group[1].style.bottom="2vmin";

                group.group[2].style.left="calc(50% - 64px - 1vmin)";
                group.group[2].style.bottom="2vmin";
                
                group.group[3].style.right="calc(50% - 64px - 1vmin)";
                group.group[3].style.bottom="2vmin";
                break;
            case 2:
                group.group.forEach(bubble=>{
                    bubble.bubble_number=0;
                    bubble.style.position ="absolute";
                    this.element.appendChild(bubble);
                });

                group.group[0].style.left="calc(50% - 42px + 15vmin)";
                group.group[0].style.top="2vmin";
                group.group[0].style.zIndex="996";

                group.group[1].style.left="calc(50% - 22px)";
                group.group[1].style.bottom="2vmin";

                group.group[2].style.left="calc(50% - 64px - 1vmin)";
                group.group[2].style.bottom="2vmin";
                
                group.group[3].style.right="calc(50% - 64px - 1vmin)";
                group.group[3].style.bottom="2vmin";

                group.group[4].style.left="calc(50% - 106px - 2vmin)";
                group.group[4].style.bottom="2vmin";
                break;

            default:
                break;
        }

    }
}

class MenuGroup{
    constructor(){ 
        this.group = [];
    }
    append(bubble){
        this.group.push(bubble);
        bubble.group = this;
    }
    remove(){
        this.group.forEach(bubble=>{
            bubble.remove();
        })
    }
}

class MenuBubble extends Bubble{
    constructor(name) {
        super();
        this.name= name;
        this.classList.add('bubble-menu');
        this.classList.add(`${this.name}-icon`);
        this.flagCreateAnimation = false;
        this.flagMoveAnimaion =false;
        this.flagMainMenuRemoveAnimaion = false;
    }
    setting(){
        super.setting();
        this.setMenuClickEvent();
    }
    setMenuClickEvent(){
        switch (this.name){
            case "home":
                this.addEventListener("click",()=>{ 
                    this.parentNode.home();
                });
                break;
            case "refresh":
                this.addEventListener("click",()=>{
                    this.parentNode.refresh();
                });
                break;
            case "leaf":
                const fileInput = document.getElementById('fileInput');
                const parent = this.parentNode;
                const group = this.group; 
                function fileInputevent(e){
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                        console.log('선택한 파일:', selectedFile);
                        console.log(selectedFile.name);
                        const seabedRect= parent.getBoundingClientRect();
                        const property = {"name":selectedFile.name,"id":null,"points":[group.points[0]/seabedRect.width,group.points[1]/seabedRect.height],"isTerminal":false};
                        const bubble = parent.createMainBubble(property);
                        upload(selectedFile,parent.id,selectedFile.name,bubble);
                        this.removeEventListener('change',fileInputevent);
                    }
                }
                this.addEventListener("click",()=>{
                    fileInput.value = null;
                    fileInput.addEventListener('change', fileInputevent);
                    fileInput.click();
                });

                break;
            case "terminal":
                console.log(this);
                this.addEventListener("click",(e)=>{
                    const inputElement = document.createElement('input');
                    inputElement.setAttribute('type', 'text');
                    this.parentNode.appendChild(inputElement);
                    // console.log(inputElement.offsetWidth);
                    inputElement.style.top="10vh";
                    inputElement.style.left=`calc(50vw - ${inputElement.offsetWidth/2}px)`;
                    inputElement.style.textAlign = 'center';
                    
                    const seabedRect= this.parentNode.getBoundingClientRect();
                    inputElement.focus();
                    const group =this.group;
                    inputElement.addEventListener('keyup', function(e){
                        if ((e.key === 'Enter' )||(e.keycode === 13 )) {
                            console.log('Enter 키가 눌렸습니다:', inputElement.value);
                            const property = {"name":inputElement.value,"id":null,"points":[group.points[0]/seabedRect.width,group.points[1]/seabedRect.height],"isTerminal":true};
                            const bubble= this.parentNode.createMainBubble(property);
                            const name = inputElement.value;
                            upload(null,this.parentNode.id,name,bubble);
                            inputElement.blur();
                        }
                    });
                    inputElement.addEventListener('blur', () => {
                        console.log('커서가 벗어났습니다:', inputElement.value);
                        inputElement.remove();
                    });
                });    
                break;
            case "parent":
                this.addEventListener("click",()=>{
                    get_parent(this.parentNode.id)
                    .then((bubble_id) => {
                        this.parentNode.id=bubble_id; 
                        this.parentNode.load();
                    })
                    .catch((error) => {
                        this.parentNode.load();
                    });
                }); 
                break;
            case "download":
                this.addEventListener("click",()=>{
                    this.parentNode.download();
                }); 
                break;

            case "delete":
                    this.addEventListener("click",()=>{
                        this.parentNode.bubble.delete();
                        this.parentNode.remove();
                    }); 
                    break;

            case "copy":
                this.addEventListener("click",()=>{
                    this.parentNode.copy();
                }); 
                break;
            case "turn_off":
                this.addEventListener("click",()=>{
                    this.parentNode.remove();
                }); 
                break;      
            case "save":
                this.addEventListener("click",()=>{
                    this.parentNode.save();
                }); 
                break;     
                

            default:
                break;
        }

    }
}

class ExpBubble extends Bubble {
    constructor(bubble) {
        super();
        this.classList.add('bubble-exp');
        this.bubble=bubble;
        this.bubble_id=this.bubble.id;
        this.bubble_flag= this.bubble.flag;
        this.bubble_exp = getExpansion(this.bubble.name);
        this.menuManager = new MenuManager(this);
        this.bubble.flagEditable = false;
        this.flagKeepAnimation=false
        this.flagContentView = true;
        this.flagMouseEvent = true;
        this.flagBubbleName = true;
        this.flagMouseSizeEvent =true;
    }
    setting(){
        this.setStyle();
        super.setting();
        this.setMouseEvent();
        this.setBubbleName();
        this.setContentView();
    }
    setStyle(){
        this.style.width=this.defaultWidth;
        this.style.height=this.defaultHeight;
        this.style.transition = "height 0.3s";
        this.style.display="flex";
        this.style.alignItems="center";
        this.style.justifyContent="center";
        var bubbleRect = this.bubble.getBoundingClientRect(); // 버튼의 위치 정보를 가져옵니다.
        this.style.position = 'absolute';
        this.style.left = `calc(${bubbleRect.left}px - 0.5 * ${this.defaultHeight} + 10vmin)`; 
        this.style.top =`calc(${bubbleRect.top}px - 0.5 * ${this.defaultWidth} + 10vmin)`; 
    }
    setMouseEvent(){
        if(this.flagMouseEvent){
            this.addEventListener("mouseenter",(e)=>{
                if(this.flagMouseSizeEvent){
                    this.style.height =`calc(${this.defaultHeight} + 4vmin + 84px)`;     
                }
                this.menuManager.create(null,2);
            })
            this.addEventListener("mouseleave",(e)=>{
                if(this.flagMouseSizeEvent){
                    this.style.height =this.defaultHeight;
                }
                this.querySelectorAll('bubble-menu').forEach(bubble=>{
                    bubble.remove();
                })
            })
        }
    }
    setBubbleName(){
        if(this.flagBubbleName){
            const file_name = document.createElement('div');
            this.file_name = file_name; 
            this.file_name.style.display="flex";
            this.file_name.style.justifyContent="center";
            this.file_name.style.alignItems="center";

            this.file_name.style.position ="absolute";
            this.file_name.style.color="rgba(255, 255, 255, 1)";
            
            this.file_name.style.zIndex="995";

            this.file_name.style.fontSize= "16px";
            this.file_name.textContent = this.bubble.name;
            this.file_name.style.textAlign="center";
            
            this.file_name.style.border="2px solid rgba(255, 255, 255, 0.7)";

            this.file_name.style.borderRadius="calc(50px - 2vmin)";
            
            this.file_name.style.width = "30vmin";
            this.file_name.style.height = "40px";
            
            this.file_name.style.left="calc(50% - 15vmin - 2px)";
            this.file_name.style.top="2vmin";

            this.appendChild(this.file_name);

            this.file_name.addEventListener("dblclick",()=>{
                const inputElement = document.createElement('input');
                    inputElement.setAttribute('type', 'text');
                    this.parentNode.appendChild(inputElement);
                    inputElement.style.top="10vh";
                    inputElement.style.left=`calc(50vw - ${inputElement.offsetWidth/2}px)`;
                    inputElement.style.textAlign = 'center';
                    const seabedRect= this.parentNode.getBoundingClientRect();
                    inputElement.focus();
                    const group =this.group;
                    inputElement.addEventListener('keyup',(e)=>{
                        if ((e.key === 'Enter' )||(e.keycode === 13 )) {
                            console.log('Enter 키가 눌렸습니다:', inputElement.value);
                            this.file_name.textContent = `${inputElement.value}.${this.bubble_exp}`;
                            inputElement.blur();
                        }
                    });
                    inputElement.addEventListener('blur', () => {
                        console.log('커서가 벗어났습니다:', inputElement.value);
                        inputElement.remove();
                    });
            });
        }
    }
    setContentView(){}
    remove(){
        super.remove();
        this.bubble.flagEditable= true;
    }
    save(){
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('method', "PUT");
        formData.append("flag",this.bubble_flag);
        formData.append('id', this.bubble_id);
        formData.append('name', this.file_name.textContent);
        xhr.open('POST', 'bubble', false);
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse["message"] == "success"){
                    alert(jsonResponse["message"]);
                    this.bubble.name=this.file_name.textContent;
                    this.bubble.textContent = `${this.bubble.name}#${this.bubble.id}`;
                }
                else{
                    alert(jsonResponse["message"]);
                }
            }
        };
        xhr.send(formData);
    }
    download(){
        const fileUrl = `bubble/download?id=${this.bubble_id}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.target = '_blank'; // 새 탭에서 열기
        downloadLink.click();
    }

}

class TxtBubble extends ExpBubble {
    constructor(bubble) {
        super(bubble);
        this.defaultHeight="60vmin";
        this.defaultWidth="60vmin";
    }
    setContentView(){
        if(this.flagContentView){
            var textUrl = `bubble?id=${this.bubble_id}`;
            const textElement = document.createElement('textarea');
            this.txt=textElement;
            const xhr = new XMLHttpRequest();            
            xhr.open('GET', textUrl, false);
            xhr.send();
            this.txt.value = xhr.responseText;
            this.txt.style.color = "black";
            this.txt.style.zIndex = "998";
            this.txt.style.border = "2px solid rgba(255, 255, 255, 0.7)";
            this.txt.style.borderRadius = "10px";
            this.txt.style.width = "55vmin";
            this.txt.style.height = "55vmin";
            this.appendChild(this.txt);
        }
    }
    save(){
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('method', "PUT");
        formData.append("flag",this.bubble_flag);
        formData.append('id', this.bubble_id);
        formData.append('name', this.file_name.textContent);
        formData.append('text',this.txt.value);
        xhr.open('POST', 'bubble', false);
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse["message"] == "success"){
                    alert(jsonResponse["message"]);
                    this.bubble.name=this.file_name.textContent;
                    this.bubble.textContent = `${this.bubble.name}#${this.bubble.id}`;
                }
                else{
                    alert(jsonResponse["message"]);
                }
            }
        };
        xhr.send(formData);
    }    
    copy(){
        new ClipboardJS(this, {
            text: ()=> {
                alert("클립보드에 복사 완료");
                return this.txt.value;
            }
        });
    }
}

class ImageBubble extends ExpBubble {
    constructor(bubble) {
        super(bubble);
        this.defaultHeight="40vmin";
        this.defaultWidth="40vmin";
    }
    setMouseEvent(){
        if(this.flagMouseEvent){
            this.addEventListener("mouseenter",(e)=>{

                this.style.height ="calc(44vmin + 84px)";       
                this.menuManager.create(null,1);
            })
            
            this.addEventListener("mouseleave",(e)=>{
                this.style.height ="40vmin";
                this.querySelectorAll('bubble-menu').forEach(bubble=>{
                    bubble.remove();
                })
            })
        }
    }
    setContentView(){
        if(this.flagContentView){
            var imageUrl = `bubble?id=${this.bubble_id}`;
            const imgElement = document.createElement('div');
            this.img= imgElement;
            this.img.style.color="white";
            this.img.style.zIndex="998";
            this.img.style.border=" 2px solid rgba(255, 255, 255, 0.7)";
            this.img.style.borderRadius="calc(50px - 2vmin)";
            this.img.style.backgroundImage = `url("${imageUrl}")`;
            this.img.style.backgroundSize ="cover";
            this.img.style.backgroundRepeat="no-repeat";
            this.img.style.backgroundPosition="center center";
            this.img.style.width = "36vmin";
            this.img.style.height = "36vmin";

            this.img.addEventListener("dblclick",()=>{
                const fileUrl = `image?id=${this.bubble_id}`;
                const downloadLink = document.createElement('a');
                downloadLink.href = fileUrl;
                downloadLink.target = '_blank';
                downloadLink.click();
            })
            this.appendChild(imgElement);
        }
    }
}

class TerminalExpBubble extends ExpBubble {
    constructor(bubble) {
        super(bubble);
        this.defaultHeight="40vmin";
        this.defaultWidth="40vmin";
        
        this.flagMouseUpEvent=true;
        // this.flagMouseSizeEvent = false;
    }   
    setContentView(){
        if(this.flagContentView){
            var textUrl = `text?id=${this.bubble_id}`;

            const textElement = document.createElement('div');
            // const textElement = new Seabed();
            textElement.id= this.bubble_id;
            this.txt=textElement;
            // const xhr = new XMLHttpRequest();            
            // xhr.open('GET', textUrl, false);
            // xhr.send(); // 텍스트 필드의 기본 텍스트 설정
            this.txt.style.color = "black";
            this.txt.style.zIndex = "998";
            this.txt.style.border = "2px solid rgba(255, 255, 255, 0.7)";
            this.txt.style.borderRadius = "10px";
            this.txt.style.width = "36vmin";
            this.txt.style.height = "36vmin";
            this.txt.load();
            this.appendChild(this.txt);
        }
    }
    setMouseEvent(){
        super.setMouseEvent();
        if(this.flagMouseUpEvent){
            this.addEventListener("mouseup",()=>{
                if ((this.parentNode.selectedBubble != null)&&(this.parentNode.selectedBubble.id != this.bubble_id)&&(this.parentNode.selectedBubble != this)){
                    const formData = new FormData();
                    formData.append("method","PATCH");
                    formData.append('flag',this.parentNode.selectedBubble.flag);
                    formData.append("id_move",this.parentNode.selectedBubble.id);
                    formData.append("id",this.bubble_id);
                    const xhr = new XMLHttpRequest();         
                    xhr.open('POST', "bubble", false);
                    xhr.onreadystatechange = ()=> {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const jsonResponse = JSON.parse(xhr.responseText);
                            if (jsonResponse["message"] == "success"){
                                this.parentNode.selectedBubble.remove();
                                // alert(jsonResponse["message"]);
                            }
                            else{
                                alert(jsonResponse["message"]);
                            }
                        }
                    };
                    xhr.send(formData);
                    
                }
            });
        }
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
    formData.append('method', "POST");
    formData.append('id', id);
    xhr.open('POST', 'bubble', true);
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
            if (bubble != null){
                const jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse["message"] == "success"){
                    bubble.id= jsonResponse["id"];
                    bubble.textContent=`${bubble.name}#${bubble.id}`;
                    bubble.isuploading=false;
                }
                else{
                    alert(jsonResponse["message"])
                    bubble.remove()
                }

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
            const menuManager = new MenuManager(this);
            menuManager.create([event.clientX,event.clientY],0);
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
            this.querySelectorAll(':scope > bubble-menu').forEach(bubble=>{
                bubble.remove();
            });
        });
        this.addEventListener('touchmove', function(event) {event.preventDefault();});
        this.addEventListener('dragover', function(event) {event.preventDefault();});
        this.addEventListener('dragleave', function(event) {event.preventDefault();});
        this.addEventListener('drop',uploadEvent);
        
    }
    connectedCallback() {        
    }
    createMainBubble(property){
        if (property["isTerminal"]){
            const bubble= new TerminalBubble(property);
            this.appendChild(bubble);
            return bubble;
        }else{
            const bubble =new LeafBubble(property);
            this.appendChild(bubble);
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
    home(){
        get_home()
        this.id=get_home();
        this.load();
    }
    refresh(){
        this.querySelectorAll('bubble-image').forEach(bubble=>{bubble.remove()});
        this.load();
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
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_home', false);
    xhr.send();
    const jsonResponse = JSON.parse(xhr.responseText);
    return jsonResponse["home"];

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
customElements.define('bubble-image', ImageBubble);
customElements.define('bubble-txt', TxtBubble);
customElements.define('bubble-teminalexp', TerminalExpBubble);

document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById("body");
    const seabed = new Seabed();
    body.appendChild(seabed);
    seabed.id= get_home()
    seabed.load();
});
