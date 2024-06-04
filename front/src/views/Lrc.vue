<template>
    <div class="lyrics-wrapper">
        <h1 style="text-align: center;">{{ name }}</h1>
        <div class="lyrics" ref="lyricsContainer">
            <div v-for="(line, index) in lyricsArray" :key="index" :id="'line-' + index" class="line"
                :class="{ active: index === currentLineIndex }" @click="seekToLine(index)">
                {{ line.text }}
            </div>

        </div>
        <!-- <button @click="goBack">返回</button> -->
        <!-- <div class="top-fade"></div>
        <div class="bottom-fade"></div> -->
    </div>
</template>

<script>
import { EventBus } from '@/bus/LrcBus.js';
export default {
    data() {
        return {
            lyrics: `[00:00.000]暂无歌词`,
            lyricsArray: [],
            currentLineIndex: 0,
            lineHeight: 32, // Assuming each line has a height of 32px
            musicinfo: {},
            name: ''
        };
    },
    mounted() {
        if (this.$store.state.globalMusicInfo) {
        this.name = this.$store.state.globalMusicInfo.name;
        const lyric = this.$store.state.globalMusicInfo.lyric;
        if (lyric) { // 添加条件检查
            this.lyrics = lyric;
            this.parseLyrics();
        }else{
            this.lyrics = `[00:00.000]暂无歌词`;
            this.parseLyrics();
        }
    }

    },
    methods: {
        parseLyrics() {
            this.lyricsArray = this.lyrics.split('\n').map((line) => {
                const [time, text] = line.split(']');
                const timeParts = time.replace('[', '').split(':');
                const timeInSeconds = parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);
                return { time: timeInSeconds, text: text ? text.trim() : '' };
            });
        },

        onTimeUpdate() {
            // 更新当前时间并滚动到当前歌词行
        },
        scrollToCurrentLine() {
            const container = this.$refs.lyricsContainer;
            if (container) {
                const currentLine = container.querySelector('.active');
                if (currentLine) {
                    const containerHeight = container.clientHeight;
                    const scrollPosition = currentLine.offsetTop - containerHeight / 2 + this.lineHeight / 2;
                    container.scrollTop = scrollPosition;
                }
            }
        },
        seekToLine(index) {
            this.sendTime(this.lyricsArray[index].time);
        },
        sendTime(currentTime) {
            EventBus.$emit('changeTime', currentTime);
        },
        goBack() {
            this.$router.go(-1); // 返回之前的页面
        },
    },
    created() {
        EventBus.$on('currentTime', (msg) => {
            const currentTime = msg;
            for (let i = 0; i < this.lyricsArray.length; i++) {
                if (currentTime >= this.lyricsArray[i].time) {
                    this.currentLineIndex = i;
                } else {
                    break;
                }
            }
            this.scrollToCurrentLine();
        });

    },

};
</script>

<style>
.lyrics-wrapper {
    position: relative;
    width: 100%;
    min-width: 600px;
    margin: auto;
    height: 500px;
}

.lyrics {
    position: relative;
    width: 100%;
    background: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    overflow-y: auto;
    height: 100%;
}

.line {
    display: block;
    width: 100%;
    padding: 5px 0;
    line-height: 1.5;
    transition: color 0.2s;
    cursor: pointer;
    box-sizing: border-box;
}

.line.active {
    color: blue;
}

/* 新增的渐变遮罩样式 */
/* .top-fade, .bottom-fade {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 300px; 
    pointer-events: none;
    z-index: 1; 
} */

/* .top-fade {
    top: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
} */

/* .bottom-fade {
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
} */
</style>
