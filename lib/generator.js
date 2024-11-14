import chalk from "chalk"
import {
    getRepoList,
    getTagList
} from "./http.js"
import path from 'path'
import {
    select
} from '@inquirer/prompts'

import downloadGitRepo from 'download-git-repo'
import util from 'util'
import ora from 'ora'

// 将 fn 异步处理逻辑 加载显示 提高用户体验
async function waitLoading(fn, message, ...args) {
    const spinner = ora(message)
    spinner.start()

    console.log(fn);

    try {
        const result = await fn(...args)
        spinner.succeed(chalk.green('get repoList success!!'))
        return result
    } catch (error) {
        spinner.fail(chalk.red('get repoList error xx!!' + error))
    }

}

class Generator {
    constructor(name, path) {
        this.name = name
        this.path = path
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    
    async getRepo() {
        const repoList = await waitLoading(getRepoList, 'upload template ing~~')

        const repos = repoList.map(item => {
            return {
                name: item.name,
                value: item.name
            }
        })
        const res = await select({
            name: 'repo',
            message: 'please select the template',
            choices: repos
        })
        return res
    }

    async getTag(repo) {
        const tagList = await waitLoading(getTagList, 'upload tags of the repo', repo)
        const tags = tagList.map(item => {
            return {
                name: item.name,
                value: item.name
            }
        })

        const res = await select({
            message: 'please select your version',
            choices: tags
        })
        return res

    }
    async downLoad(repo, tag) {

        const requestPath = `zhurong-cli/${repo}${tag?'#'+tag:''}`

        await waitLoading(
            this.downloadGitRepo,
            'waiting download template',
            requestPath,
            path.resolve(process.cwd(), this.name)
        )
    }

    async create() {
        const repo = await this.getRepo()
        console.log(repo);
        const tag = await this.getTag(repo)
        console.log(tag);

        await this.downLoad(repo, tag)

        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')

    }
}

export default Generator