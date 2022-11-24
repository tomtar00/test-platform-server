const token = require('../../src/middleware/token')

describe('Access token', () => {

    it('can generate token', () => {
        const username = 'test'
        const userId = 1
        expect(token.generateAccessToken(username, userId)).not.toBeNull()
    })

    it('is expired', () => {
        const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOjEsImV4cCI6MTY2OTMwMTI1NX0.5T-1TpVbqu4PKPmlrSms8tvgIz5B_qcupX5SAzA0i4w'
        expect(token.isTokenExpired(expired_token)).toBe(true)
        const valid_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOjEsImV4cCI6Nzk4MDY0ODQ1NX0.N3ledfl4q0s19nyTrjc3rvHQA-04kluK-aqhJQxb8Vg'
        expect(token.isTokenExpired(valid_token)).toBe(false)
    })

    it('can calculate time to expire', () => {
        const _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWQiOjEsImV4cCI6Nzk4MDY0ODQ1NX0.N3ledfl4q0s19nyTrjc3rvHQA-04kluK-aqhJQxb8Vg'
        expect(token.timeToExpire(_token)).toBeGreaterThan(0)
    })

})