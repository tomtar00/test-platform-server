const ResultService = require('../../src/service/resultService')
const { exc } = require('../../src/utils/applicationException')

describe('Result Service', () => {

    const resultService = new ResultService()

    const testResults = {
        test_id: 1,
        test_name: 'test_1',
        user_id: 1,
        user_name: 'student',
        points: 3,
        max_points: 3,
        id: 1
    }
    const resultKeys = Object.keys(testResults)

    const responseToResult = (res) => {
        const result = res[0]
        delete result.date
        return result
    }

    it('can find results', async () => {

        const resultById = await resultService.find(1)
        const result = responseToResult(resultById)
        expect(result).toEqual(testResults)

        const resultsByUserName = await resultService.find(null, 'student')
        expect(Object.keys(responseToResult(resultsByUserName))).toEqual(resultKeys)
        expect(resultsByUserName.map(a => a.user_name).every(name => name === 'student')).toBe(true)

        const resultsByTestName = await resultService.find(null, null, 'test_1')
        expect(Object.keys(responseToResult(resultsByTestName))).toEqual(resultKeys)
        expect(resultsByTestName.map(a => a.test_name).every(name => name === 'test_1')).toBe(true)

        await expect(resultService.find(-1)).rejects.toBeInstanceOf(exc)
        await expect(resultService.find(null, 'xxx')).rejects.toBeInstanceOf(exc)
        await expect(resultService.find(null, null, 'xxx')).rejects.toBeInstanceOf(exc)

    })

})