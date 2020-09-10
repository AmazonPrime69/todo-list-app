const {MSICreator} = require('electron-wix-msi');
const path = require('path');

const APP_DIR = path.resolve(__dirname, './to-do-list-win32-x64')
const OUT_DIR = path.resolve(__dirname, './windows_installer')

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    description: 'A simple to-do list I coded with electron',
    exe: 'to-do-list',
    name: 'to-do list Desktop App',
    manufacturer: 'Zachary Robinson',
    version: '1.0.0',

    ui: {
        chooseDirectory: true
    },
})

msiCreator.create().then(function() {
    msiCreator.compile()
})