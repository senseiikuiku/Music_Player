// 1. Render songs
// 2. Scroll top
// 3. play / pause / seek
// 4. CD ratate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9.Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Music player";

const playlist = $(".playlist");

const player = $(".player");
const cd = $(".cd");
const progress = $("#progress");

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");

const playBtn = $(".btn-toggle-play");

const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const downVolumeBtn = $(".btn-down-volume");
const upVolumeBtn = $(".btn-up-volume");
const volumeSlider = $(".volume-slider");

const currentTimeRunSong = $(".current-time");
const sumTimeSong = $(".duration");

const bg_shine = $(".fa-sun");
const body_bg = $("body");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isBg: false,
    currentVolume: 1,
    congfig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Anh Là Của Em",
            singer: "Karik",
            path: "./assets/music/AnhLaCuaEm.mp3",
            image: "./assets/image/song1.png",
        },
        {
            name: "cô Gái M52",
            singer: "HuyR",
            path: "./assets/music/CoGaiM52.mp3",
            image: "./assets/image/song2.png",
        },
        {
            name: "Cùng Anh",
            singer: "Ngọc Dolil",
            path: "./assets/music/CungAnh.mp3",
            image: "./assets/image/song3.png",
        },
        {
            name: "Dịu Dàng Em Đến",
            singer: "Erik",
            path: "./assets/music/DiuDangEmDen.mp3",
            image: "./assets/image/song4.png",
        },
        {
            name: "Là Anh",
            singer: "Phạm Lịch",
            path: "./assets/music/LaAnh.mp3",
            image: "./assets/image/song5.png",
        },
        {
            name: "Một Năm Mới Bình An",
            singer: "Sơn Tung MTP",
            path: "./assets/music/MotNamMoiBinhAn.mp3",
            image: "./assets/image/song6.png",
        },
        {
            name: "Một Nhà",
            singer: "Da LAB",
            path: "./assets/music/MotNha.mp3",
            image: "./assets/image/song7.png",
        },
        {
            name: "Nơi Này Có Anh",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/NoiNayCoAnh.mp3",
            image: "./assets/image/song8.png",
        },
        {
            name: "Thị Mầu",
            singer: "Hòa Minzy",
            path: "./assets/music/ThiMau.mp3",
            image: "./assets/image/song9.png",
        },
        {
            name: "Yêu Anh Thế Thôi",
            singer: "PINKY x Hào JK",
            path: "./assets/music/YeuAnhTheThoi.mp3",
            image: "./assets/image/song10.png",
        },
    ],
    setConfig: function (key, value) {
        this.congfig[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.congfig));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
           <div class="song ${
               index == this.currentIndex ? "active" : ""
           }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
                
            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 8000, // quay 1 vòng trong 8 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // Xử lý phóng ca / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 100 ? newCdWidth + "px" : 100 + "px";
            cd.style.opacity =
                newCdWidth / scrollTop > 0.6 ? newCdWidth / scrollTop : 1;
        };

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }

            // Xử lý tài nguyên audio được tải
            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSenconds = Math.floor(audio.currentTime % 60);
            // Hiển thị thời gian hiện tại ở định dạng phút và giây
            currentTimeRunSong.textContent = `${currentMinutes}:${
                currentSenconds < 10 ? "0" : ""
            }${currentSenconds} `;
        };

        // Khi tài nguyên audio được tải
        audio.onloadedmetadata = function () {
            const durationMinutes = Math.floor(audio.duration / 60);
            const durationSenconds = Math.floor(audio.duration % 60);
            // Hiển thị tổng thời gian của 1 Song
            sumTimeSong.textContent = `${durationMinutes}:${
                durationSenconds < 10 ? "0" : ""
            }${durationSenconds}`;
        };

        // Xử lý khi tua song
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xử lý lặp lại một song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Xử lý thay đổi Background
        bg_shine.onclick = function () {
            _this.isBg = !_this.isBg;
            _this.setConfig("isBg", _this.isBg);
            if (_this.isBg) {
                body_bg.classList.add("body-bg");
            } else {
                body_bg.classList.remove("body-bg");
            }
        };

        // Xử lý tăng âm lượng
        upVolumeBtn.onclick = function () {
            if (audio.volume < 1)
                audio.volume = parseFloat(audio.volume + 0.1).toFixed(1);
            _this.setConfig("currentVolume", audio.volume);
        };

        // Xử lý giảm âm lượng
        downVolumeBtn.onclick = function () {
            if (audio.volume > 0) {
                audio.volume = parseFloat(audio.volume - 0.1).toFixed(1);
                _this.setConfig("currentVolume", audio.volume);
            }
        };

        // Xử lý khi kéo thanh âm lượng
        volumeSlider.oninput = function () {
            audio.volume = parseFloat(this.value);
            _this.setConfig("currentVolume", this.value);
        };

        // Cập nhật giá trị khi kéo Volume
        audio.onvolumechange = function () {
            volumeSlider.value = audio.volume;
        };

        // Lắng nghe hành vi vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào trong option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },
    loadCurrentSong: function () {
        if (this.currentSong) {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
            this.setConfig("currentIndex", this.currentIndex);
        } else {
            // Xử lý nếu không có bài hát hiện tại
            console.error("Không có bài hát hiện tại");
        }
    },
    loadConfig: function () {
        this.isRandom = this.congfig.isRandom;
        this.isRepeat = this.congfig.isRepeat;
        this.currentIndex = this.congfig.currentIndex;
        this.isBg = this.congfig.isBg;
        if (this.congfig.currentVolume != null) {
            volumeSlider.volume = this.congfig.currentVolume;
            audio.volume = this.congfig.currentVolume;
        }
        if (this.isBg) {
            body_bg.classList.add("body-bg");
        } else {
            body_bg.classList.remove("body-bg");
        }
    },
    scrollToTop: function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    },
    scrollToTopPlayList: function () {
        playlist.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
            this.render();
            this.scrollToTop();
            this.loadCurrentSong();
        } else {
            this.loadCurrentSong();
        }
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuốc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trang thái ban đầu của button repeat & random & background
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
        bg_shine.classList.toggle("body-bg", this.isBg);

    },
};

app.start();
