const auth = require('../../src/middleware/auth')
const { exc, FORBIDDEN, UNAUTHORIZED } = require('../../src/utils/applicationException')

describe('Authorization', () => {

    // tokens
    const student = null
    const teacher = null
    const admin = null

    // simulate request object
    const req = (accessToken) => {
        return {
            headers: {
                accessToken
            }
        }
    }

    // simulate response object
    const res = () => {
        return {
            set : (a, b) => {}
        }
    }

    const permissions = [
        "can_manage_permissions",
        "can_manage_tests",
        "can_view_stats",
        "can_access_admin_panel"
    ]
    const student_permissions = [
        false,
        false,
        false,
        false
    ]
    const teacher_permissions = [
        false,
        true,
        true,
        false
    ]
    const admin_permissions = [
        true,
        true,
        true,
        true
    ]

    const checkPermissions = (token, user_permissions) => {
        const _req = req(token)
        const _res = res()
        const promises = []

        for (let i = 0; i < user_permissions.length; i++) {
            const expectation = expect(auth.authorize(_req, _res, perm => {
                return Promise.resolve(perm[permissions[i]])
            }))
            const promise = user_permissions[i] ?
                expectation.resolves.toEqual(true) :
                expectation.rejects.toBeInstanceOf(exc)
            promises.push(promise)
        }

        return Promise.all(promises)
    }

    it('should work with student permissions', () => {
        return checkPermissions(student, student_permissions)
    })

    it('should work with teacher permissions', () => {
        return checkPermissions(teacher, teacher_permissions)
    })

    it('should work with admin permissions', () => {
        return checkPermissions(admin, admin_permissions)
    })

    it('forbids access when no token was provided', async () => {
        const exception = await auth.authorize(req(null), res(), perm => {
            return perm.manage_permissions
        }).catch(x => x)
        return expect(exception.error).toEqual(UNAUTHORIZED)
    })

    it('forbids resource when token is expired', async () => {
        const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOjEsImV4cCI6MTY2OTMwMTI1NX0.5T-1TpVbqu4PKPmlrSms8tvgIz5B_qcupX5SAzA0i4w'
        const exception = await auth.authorize(req(expired_token), res(), perm => {
            return perm.manage_permissions
        }).catch(x => x)
        expect(exception.error).toEqual(FORBIDDEN)
    })
})