const ipcRenderer = require("electron").ipcRenderer;
const { v4: uuidv4 } = require('uuid');
const { execSync } = require('child_process');
const path = require('path')

const fs = require("fs")
let dir = process.cwd();

new Vue({
    el: '#app',
    data: {
        date: "",
        groups: [],
        contacts: [],
        content: "",
        mode: "",
        menu: "GROUP",
        startTime: "",
        endTime: "",
        duration: ""
    },
    methods: {
        Taobao() {
            execSync('start chrome https://edgehacker.taobao.com')
        },
        CloseApp() {
            ipcRenderer.send("close-app")
        },
        MiniApp() {
            ipcRenderer.send("resize-app")
        },
        SearchRecord() {
            ipcRenderer.send("search-record")
        },
        SearchStatus() {
            ipcRenderer.send("search-status")
        },
        OpenStatus() {
            ipcRenderer.send("open-status")
        },
        SetFormMode(mode) {
            this.mode = mode
        },
        StopWeixinBot() {
            ipcRenderer.send("stop-bot")
        },
        StartWeixinBot() {
            ipcRenderer.send("start-bot")
        },
        DeleteGroup(id) {
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
            const recordToDelete = { id: id };
            const index = this.groups.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.groups.splice(index, 1); }
            let updatedData = JSON.stringify(this.groups);
            fs.writeFileSync(path.join(dir, 'weixinbot', 'groups.json'), updatedData, 'utf8');
            this.StartGroup()
        },
        DeleteContact(id) {
            let deleteAudio = document.getElementById("delete-audio")
            deleteAudio.play()
            const recordToDelete = { id: id };
            const index = this.contacts.findIndex(item => item.id === recordToDelete.id);
            if (index !== -1) { this.contacts.splice(index, 1); }
            let updatedData = JSON.stringify(this.contacts);
            fs.writeFileSync(path.join(dir, 'weixinbot', 'contacts.json'), updatedData, 'utf8');
            this.StartGroup()
        },
        AddForm() {
            if (this.mode == "" || this.content == "") { return }

            const newRecord = { id: uuidv4(), content: this.content };
            if (this.mode == "群组增加") {
                let state = false
                this.groups.forEach(item => {
                    if (item.content == this.content) {
                        state = true
                        return
                    }
                });
                if (state) {
                    let errorAudio = document.getElementById("error-audio")
                    errorAudio.play()
                    return
                } else {
                    let successAudio = document.getElementById("success-audio")
                    successAudio.play()
                }
                this.groups.push(newRecord);
                let updatedData = JSON.stringify(this.groups);
                fs.writeFileSync(path.join(dir, 'weixinbot', 'groups.json'), updatedData, 'utf8')
                this.groups = JSON.parse(fs.readFileSync(path.join(dir, 'weixinbot', 'groups.json'), 'utf8'))
            }
            if (this.mode == "客服增加") {
                let state = false
                this.contacts.forEach(item => {
                    if (item.content == this.content) {
                        state = true
                        return
                    }
                });
                if (state) {
                    let errorAudio = document.getElementById("error-audio")
                    errorAudio.play()
                    return
                } else {
                    let successAudio = document.getElementById("success-audio")
                    successAudio.play()
                }
                this.contacts.push(newRecord);
                let updatedData = JSON.stringify(this.contacts);
                fs.writeFileSync(path.join(dir, 'weixinbot', 'contacts.json'), updatedData, 'utf8')
                this.contacts = JSON.parse(fs.readFileSync(path.join(dir, 'weixinbot', 'contacts.json'), 'utf8'))
            }
            this.content = ""
            this.mode = ""
        },
        Restartform() {
            this.content = ""
        },
        SubmitTime() {
            let timeConfig = { startTime: this.startTime, endTime: this.endTime, duration: parseInt(this.duration) }
            fs.writeFileSync(path.join(dir, 'weixinbot', 'time.json'), JSON.stringify(timeConfig), 'utf8')
            let successAudio = document.getElementById("success-audio")
            successAudio.play()
        }
    },
    mounted() {
        this.timeConfig = JSON.parse(fs.readFileSync(path.join(dir, 'weixinbot', 'time.json'), 'utf8'))
        this.startTime = this.timeConfig.startTime
        this.endTime = this.timeConfig.endTime
        this.duration = this.timeConfig.duration
        this.groups = JSON.parse(fs.readFileSync(path.join(dir, 'weixinbot', 'groups.json'), 'utf8'))
        this.contacts = JSON.parse(fs.readFileSync(path.join(dir, 'weixinbot', 'contacts.json'), 'utf8'))
    }
})