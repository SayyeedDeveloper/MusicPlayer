const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music_list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusics.length) + 1 );

window.addEventListener("load", () =>{
    loadMusic(musicIndex);
    playingNow(); 
});

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusics[indexNumb - 1].name;
    musicArtist.innerText = allMusics[indexNumb - 1].artist;
    musicImg.src =`images/${allMusics[indexNumb - 1].image}.jpg`;
    mainAudio.src =`musics/${allMusics[indexNumb - 1].src}.mp3`;
};  

//play music function 

function playMusic(){
    wrapper.classList.add("paused")
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function 
function pauseMusic(){
    wrapper.classList.remove("paused")
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// next music function

function nextMusic(){
    musicIndex++;
    musicIndex > allMusics.length ? musicIndex = 1 : musicIndex == musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// prev music function

function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusics.length : musicIndex == musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//play or music button 
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic();
}); 

// prev music btn event 
prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

// update progress bar  width according to music correct time 

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic()
})

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    };

});

mainAudio.addEventListener("ended", ()=>{

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic()
            break;
        case "shuffle":
            let ranIndex = Math.floor((Math.random() * allMusics.length) + 1 );
            do{
                ranIndex = Math.floor((Math.random() * allMusics.length) + 1 );
            }while(musicIndex == ranIndex);
            musicIndex = ranIndex;
            loadMusic(musicIndex);
            playMusic(musicIndex);
            playingNow();
            break;
    };
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusics.length; i++) {
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusics[i].name}</span>
                        <p>${allMusics[i].artist}</p>
                    </div>
                    <audio class="${allMusics[i].src}" src="/musics/${allMusics[i].src}.mp3"></audio>
                    <span id="${allMusics[i].src}" class="audio_duration">00:00</span>
                </li>` ;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusics[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusics[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{ 
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`; 
        
        liAudioDuration.setAttribute("ti-duration",`${totalMin}:${totalSec}`);
    });
}
 
const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0 ; j < allLiTags.length ; j++){
        let audioTag = allLiTags[j].querySelector(".audio_duration")
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("ti-duration");
            audioTag.innerText = adDuration;

        }

        if(allLiTags[j].getAttribute("li-index")==musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing"
        }
    
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow() ;
}





















