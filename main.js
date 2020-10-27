var theme_file = document.querySelector("#theme-link");

if(localStorage.getItem('theme') == "dark"){
    theme_file.href = "dark-theme.css";
    document.getElementById("themeToggle").checked = true;
    console.log("loadPage with dark");
}
else{
    theme_file.href = "light-theme.css";
    document.getElementById("themeToggle").checked = false;
    console.log("loadPage with light");
}

// function toggleCheck(cb){
//     if(localStorage.getItem('theme') == "dark"){
//         cb.checked = true;
//         console.log("true check");
//     }
//     else{
//         cb.checked = false;
//         console.log("false check");
//     }
// }

function handleClick(cb) {
    if (cb.checked) {
        theme_file.href = "dark-theme.css";
        localStorage.setItem("theme", "dark");
        console.log("dark stored true");
    
    } else {
        theme_file.href = "light-theme.css";
        localStorage.setItem("theme", "light");
        console.log("dark false");
  }
}

document.getElementById("live-view-btn").addEventListener("click",function(){
    if(document.getElementById("live-view").style.display == 'none'){
        document.getElementById("live-view").style.display = 'flex';
    }
    else{
        document.getElementById("live-view").style.display = 'none';
    }    
});
