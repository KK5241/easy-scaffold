#! /usr/bin/env node


import {
    program
} from 'commander'
import {createFile} from '../lib/create.js'
import figlet from 'figlet'
import chalk from 'chalk'



// cli 命令以及参数处理
// create 创建项目  -f 是否强制覆盖已有文件
// 调用create 进入createFile逻辑
program
    .name('zz')
    .command('create <name>')
    .description('create a new project')
    .option('-f, --force', 'Forced Overwrite File')
    .action((name, options) => {
        createFile(name, options)
    })

program
    .version('1.0.0')
    .usage('<command> [options]')

program.on('--help', () => {
    console.log('\r\n' + figlet.textSync('zz', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));


    console.log(`\r\nRun ${chalk.blue(`zz <command> --help`)} for detailed usage of given command\r\n`);

})

program.parse(program.argv)