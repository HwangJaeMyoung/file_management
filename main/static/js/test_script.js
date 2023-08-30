document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("wrapper");
  let selectedButton =null;
  let isDragging = false;
  let isClick =false;
  var wrapperWidth = wrapper.clientWidth;
  var wrapperHeight = wrapper.clientHeight;

  function getChildElementsByClassName(parentElement, className) {
    var childElements = parentElement.getElementsByClassName(className);
    return Array.from(childElements);
  }
  function removeClassFromElements(elements, className,bubble_number) {
    getChildElementsByClassName(elements,className).forEach(button=>{
      button.classList.remove("keep-Animation");
      button.classList.add("fade-Animation");
      setTimeout(() => {
        button.remove();
      },1000);

      var buttonRect = button.getBoundingClientRect();
      var buttonX = buttonRect.left+ buttonRect.width / 2;
      var buttonY = buttonRect.top + buttonRect.height / 2;
      for (let i = 0; i < bubble_number; i++) {
        setTimeout(() =>{
          const bubble = document.createElement('div');
          bubble.className = 'bubble';
          bubble.style.animationDuration = "4s"
          bubble.style.left = `${(Math.random()-0.5) * buttonRect.height  + buttonX -20}px`;
          bubble.style.top = `${(Math.random()-0.5)* buttonRect.height + buttonY-20}px`;
          wrapper.appendChild(bubble);
          setTimeout(() => {
            bubble.style.display = 'none';
          },2000+2000*Math.random());
        },1000*Math.random());
      }
    });
  }

  function createButton(wrapper,buttonList,pointsList){
    removeClassFromElements(wrapper,"bubble-button",30);
    
    var i=0;
    buttonList.forEach(buttonText =>{
      const button = document.createElement("button");
      button.textContent = buttonText;
      button.className = "bubble-button";
      wrapper.appendChild(button);
      var left=pointsList[i][0]*100;
      var top=pointsList[i][1]*100;

      if (wrapperWidth<wrapperHeight){
        button.style.width="20vw";
        button.style.height="20vw";
        button.style.top = "calc("+top.toString() +"vh - 10vw)";
        button.style.left = "calc("+left.toString()+"vw - 10vw)";
      }else{
        button.style.width="20vh";
        button.style.height="20vh";
        button.style.top = "calc("+top.toString() +"vh - 10vh)";
        button.style.left = "calc("+left.toString()+"vw - 10vh)";
      }
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            wrapperWidth = entry.contentRect.width;
            wrapperHeight= entry.contentRect.height;
            if (wrapperWidth<wrapperHeight){
                button.style.width="20vw";
                button.style.height="20vw";
            }else{
                button.style.width="20vh";
                button.style.height="20vh";
            }
        }
      });
      resizeObserver.observe(wrapper);
      i++;
    });
    createButtonEvent(wrapper)
  }



  function createButtonEvent(wrapper){
    getChildElementsByClassName(wrapper,"bubble-button").forEach(button=>{
      button.addEventListener("mousedown", function(e) {
        isDragging = true;
        selectedButton=this;
        document.addEventListener("mousemove", handleMouseMove);
      });
      button.addEventListener("touchstart", function(e) {
        isDragging = true;
        selectedButton=this;
        const touch = e.touches[0];
        offsetX = touch.clientX - button.getBoundingClientRect().left;
        offsetY = touch.clientY - button.getBoundingClientRect().top;
      });
      button.addEventListener("animationend", function(event) {
        if (event.animationName === "createAnimation") {
            button.classList.remove(".create-Animation");
            button.classList.add("keep-Animation");
        }
      });
      button.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        button.classList.remove("keep-Animation");
        button.classList.add("fade-Animation");
        setTimeout(() => {
            button.style.display = 'none';
        },1000);
        var buttonRect = button.getBoundingClientRect();
        var buttonX = buttonRect.left+ buttonRect.width / 2;
        var buttonY = buttonRect.top + buttonRect.height / 2;
        
        for (let i = 0; i < 30; i++) {
          setTimeout(() =>{
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.animationDuration = "4s"
            bubble.style.left = `${(Math.random()-0.5) * buttonRect.height  + buttonX -20}px`;
            bubble.style.top = `${(Math.random()-0.5)* buttonRect.height + buttonY-20}px`;
            wrapper.appendChild(bubble);
            setTimeout(() => {
              bubble.style.display = 'none';
            },2000+2000*Math.random());
          },1000*Math.random());
        }
        if(isClick == false){
          isClick=true;
          var sendData = {
              "path": path + "/"+ button.textContent
          };
          $.ajax({
            type: 'POST', // 또는 'GET'
            url: "dir", // 장고 뷰의 URL
            data: JSON.stringify(sendData),
            contentType: 'application/json',
            success: function(response) {
              if(response["isdir"]){
                createButton(wrapper,response["button_list"],response["points_list"])
                path= path + "/"+ button.textContent;
              }
            },
            error: function(error) {
              console.error('에러 발생:', error);
            }
          });
          isClick=false;
        }

      });
    });
  }
  function settingArea(wrapper){
    createButton(wrapper,buttonList,pointsList);
  }
  settingArea(wrapper);

  function createMeunEvent(wrapper){
    wrapper.addEventListener("dblclick", (event) =>{
      event.stopPropagation()
      const bubble = document.createElement('div');
      const side_bubble = document.createElement('div');

      bubble.classList.add('bubble-blank');
      side_bubble.classList.add('bubble-blank');
      const clickX = event.clientX - 20;
      const clickY = event.clientY - 20;
      bubble.classList.add("spread-Animation");
      side_bubble.classList.add("spread-Animation");
      
      // 클릭된 위치를 버블의 위치로 설정
      bubble.style.left = clickX + 'px';
      bubble.style.top = clickY + 'px';
      side_bubble.style.left=bubble.style.left;
      side_bubble.style.top=bubble.style.top;
      
      wrapper.appendChild(bubble);
      setTimeout(() => {
        bubble.remove()
      }, 1000);

      setTimeout(() => {
        wrapper.appendChild(side_bubble);
        setTimeout(() => {
          side_bubble.remove()
        }, 1000);
      }, 250);
      setTimeout(() => {
        function createMeunBubble(menuList){
          var i=0;
          const count =5;
          menuList.forEach(menu=>{
            const bubble = document.createElement('button');
            bubble.classList.add('bubble-blank');
            bubble.addEventListener("dblclick",(event)=>{
              event.stopPropagation();
            });
            if (menu=="새로고침"){
              bubble.classList.add("refresh-icon");
            }
            else if (menu=="뒤로가기"){
              bubble.classList.add("parentdir-icon");
            }
            else if (menu=="새 폴더"){
              bubble.classList.add("adddir-icon");
              console.log(path);
              bubble.addEventListener("click",(event)=>{
                const inputElement = document.createElement('input');
                inputElement.setAttribute('type', 'text');
                wrapper.appendChild(inputElement);
                console.log(inputElement.offsetWidth);
                inputElement.style.top="10vh";
                inputElement.style.left=`calc(50vh - ${inputElement.offsetWidth/2}px)`;
                inputElement.style.textAlign = 'center';
                inputElement.focus();
                inputElement.addEventListener('keyup', (event) => {
                  if ((event.key === 'Enter' )||(event.keycode === 13 )) {
                    console.log('Enter 키가 눌렸습니다:', inputElement.value);
                    var sendData = {
                      "path": path + "/"+inputElement.value
                    };
                    $.ajax({
                      type: 'POST',
                      url: "adddir", // 장고 뷰의 URL
                      data: JSON.stringify(sendData),
                      contentType: 'application/json',
                      success: function(response) {
                        console.log(response)

                        removeClassFromElements(wrapper,"bubble-blank");
                        if(response["state"]){
                          createButton(wrapper,response["button_list"],response["points_list"])
                          // path= path + "/"+ button.textContent;
                        }
                      },
                      error: function(error) {
                        console.error('에러 발생:', error);
                      }      
                      });           
                  }
                });
                inputElement.addEventListener('blur', () => {
                  console.log('커서가 벗어났습니다:', inputElement.value);
                  inputElement.remove();
                });
                
              });

              
   
            }
            else if (menu=="홈"){
              bubble.classList.add("home-icon");
            }else{
              bubble.classList.add("add-icon");
            }
            

            
            const clickX = event.clientX -20;
            const clickY = event.clientY -20;

            bubble.style.left = clickX + 'px';
            bubble.style.top = clickY + 'px';


            bubble.classList.add(`orbit-Animation-${i}`);
            const angle = (2 * Math.PI * i) / count
            const y = parseFloat((Math.cos(angle)).toFixed(2));
            const x = parseFloat((Math.sin(angle)).toFixed(2));
            bubble.addEventListener("animationend", function(event) {
              if (event.animationName == 'orbitAnimation0' ){
                bubble.style.left=`${clickX-40*x}` + 'px';
                bubble.style.top = `${clickY-40*y}` + 'px';
                bubble.classList.remove('orbit-Animation-0');
                bubble.classList.add("keep-Animation");
              }
              else if (event.animationName == `orbitAnimation1` ){
                bubble.style.left=`${clickX-40*x}` + 'px';
                bubble.style.top = `${clickY-40*y}` + 'px';
                bubble.classList.remove('orbit-Animation-1');
                bubble.classList.add("keep-Animation");
              }else if (event.animationName == `orbitAnimation2` ){
                bubble.style.left=`${clickX-40*x}` + 'px';
                bubble.style.top = `${clickY-40*y}` + 'px';
                bubble.classList.remove('orbit-Animation-2');
                bubble.classList.add("keep-Animation");
              }else if (event.animationName == `orbitAnimation3` ){
                bubble.style.left=`${clickX-40*x}` + 'px';
                bubble.style.top = `${clickY-40*y}` + 'px';
                bubble.classList.remove('orbit-Animation-3');
                bubble.classList.add("keep-Animation");
              }else if (event.animationName == `orbitAnimation4`){
                bubble.style.left=`${clickX-40*x}` + 'px';
                bubble.style.top = `${clickY-40*y}` + 'px';
                bubble.classList.remove('orbit-Animation-4');
                bubble.classList.add("keep-Animation");
              }
              else if (event.animationName == "fadeAnimation"){
                bubble.remove();
              }
              bubble.addEventListener("click",(event)=>{
                event.stopPropagation();
                bubble.classList.remove("keep-Animation");
                bubble.classList.add("fade-Animation");
              });
            });
            setTimeout(() => {
              wrapper.appendChild(bubble);
            }, i*100);
            i++;
          });     
        }
        createMeunBubble(["새 폴더","새 파일","새로고침","뒤로가기","홈"]);
      }, 0);
    });
  }
  createMeunEvent(wrapper);
  
  wrapper.addEventListener("click",(event)=>{
    event.stopPropagation();
    removeClassFromElements(wrapper,"bubble-blank",3);
  });

  


  function handleMouseMove(e) {
    if (isDragging) {
      wrapperWidth = wrapper.clientWidth;
      wrapperHeight = wrapper.clientHeight;
      if (wrapperWidth<wrapperHeight){
          selectedButton.style.left = `calc(${e.clientX}px - 10vw)`;
          selectedButton.style.top = `calc(${e.clientY}px - 10vw)`;
      }
      else{
          selectedButton.style.left = `calc(${e.clientX}px - 10vh)`;
          selectedButton.style.top = `calc(${e.clientY}px - 10vh)`;
      }
      var leftRatio = (selectedButton.getBoundingClientRect().left - wrapper.getBoundingClientRect().left) / wrapperWidth;
      var topRatio = (selectedButton.getBoundingClientRect().top - wrapper.getBoundingClientRect().top) / wrapperHeight;

      selectedButton.style.left = `${leftRatio * 100}vw`;
      selectedButton.style.top = `${topRatio * 100}vh`;
    }
  }

  document.addEventListener("mouseup", function() {
  if (isDragging) {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
  }
  });
  document.addEventListener("touchmove", function(e) {
      if (isDragging) {
        const touch = e.touches[0];
        selectedButton.style.left = `${touch.clientX - offsetX}px`;
        selectedButton.style.top = `${touch.clientY - offsetY}px`;
      }
  });

  document.addEventListener("touchend", function() {
      isDragging = false;
  });


  wrapper.addEventListener('dragover', function(event) {
    event.preventDefault();
    wrapper.style.borderColor = 'blue';
    console.log("dragover");
  });

  wrapper.addEventListener('dragleave', function(event) {
    event.preventDefault();
    wrapper.style.borderColor = '#ccc';
    console.log("dragleave");
  });

  wrapper.addEventListener('drop', function(event) {
    event.preventDefault();
    wrapper.style.borderColor = '#ccc';
    console.log("drop");
    
    const files = event.dataTransfer.files;
    const file = files[0];

    console.log('드롭한 파일 이름:', file.name);
    console.log('드롭한 파일 크기:', file.size, '바이트');
    console.log('드롭한 파일 타입:', file.type);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('path', path);

    // 서버로 파일 업로드를 위한 AJAX 요청을 보냅니다.
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log('파일 업로드 성공:', xhr.responseText);
      }
    };
    xhr.send(formData);


  });

  // 버블 생성
  const bubble_number = 5;
  for (let i = 0; i < bubble_number; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      wrapper.appendChild(bubble);
  }
});
