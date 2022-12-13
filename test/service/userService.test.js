const UserService = require("../../src/service/userService")
const { exc } = require("../../src/utils/applicationException")

describe('User service', () => {
    
    const userService = new UserService()

    // simulate response object
    const res = () => {
        return {
            set : (a, b) => {}
        }
    }

    it('can authenticate users', async () => {
        const credentials = {
            username: "student",
            password: "student123"
        }
        const auth = await userService.authenticate(credentials, res())
        expect(auth).toBeDefined()

        const auth_fail = await userService.authenticate({}, res()).catch(x => x)
        expect(auth_fail).toBeInstanceOf(exc)
    })
    
    it('can find users', async () => {
        const userFromId = await userService.find('1')
        const userFromName = await userService.find(null, 'student', 1, 1)
        const userPage = await userService.find(null, null, 1, 3)

        expect(userFromId[0]).toHaveProperty('account_name')
        expect(userFromName[0]).toHaveProperty('account_name')
        expect(userPage).toHaveLength(3)

        const userFromId_fail = await userService.find(-1).catch(x => x)
        const userFromName_fail = await userService.find(null, '000').catch(x => x)
        const userPage_fail = await userService.find(null, null, 1, -1).catch(x => x)

        expect(userFromId_fail).toBeInstanceOf(exc)
        expect(userFromName_fail).toBeInstanceOf(exc)
        expect(userPage_fail).toBeInstanceOf(exc)
    })

    it('can get groups and permissions of a user', async () => {
        const userId = '1'

        const groups = await userService.findAllGroups()
        const userGroups = await userService.findUserGroups(userId)
        const userPermissions = await userService.findUserPermissions(userId)

        expect(groups.length).toBeGreaterThan(0)
        expect(userGroups.length).toBeGreaterThan(0)
        expect(userPermissions.length).toBeGreaterThan(0)

        const userGroups_fail = await userService.findUserGroups(-1).catch(x => x)
        const userPermissions_fail = await userService.findUserPermissions(-1).catch(x => x)

        expect(userGroups_fail).toBeInstanceOf(exc)
        expect(userPermissions_fail).toBeInstanceOf(exc)
    })

})