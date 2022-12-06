const AnswerService = require('./../../src/service/answerService')

describe('Answer Service', () => {

    const answerService = new AnswerService()

    const answersToFirstTest = [
        {
            test_id: 1,
            question_id: 1,
            user_id: 1,
            given_answer_idx: [0]
        },
        {
            test_id: 1,
            question_id: 2,
            user_id: 1,
            given_answer_idx: [1]
        },
        {
            test_id: 1,
            question_id: 3,
            user_id: 1,
            given_answer_idx: [0, 1, 2]
        }
    ]
    const answersKeys = Object.keys(answersToFirstTest[0]).concat('id')

    const testResults = {
        test_id: 1,
        test_name: 'test_1',
        user_id: 1,
        user_name: 'student',
        points: 3,
        max_points: 3,
        id: 6
    }

    it('can find answers', async () => {

        const answerById = await answerService.find(1)
        expect(Object.keys(answerById[0])).toEqual(answersKeys)
        expect(answerById[0].id).toBe(1)

        const answersByQuestionId = await answerService.find(null, 1)
        expect(Object.keys(answersByQuestionId[0])).toEqual(answersKeys)
        expect(answersByQuestionId.map(a => a.question_id).every(id => id === 1)).toBe(true)

        const answersByUserId = await answerService.find(null, null, 1)
        expect(Object.keys(answersByUserId[0])).toEqual(answersKeys)
        expect(answersByQuestionId.map(a => a.user_id).every(id => id === 1)).toBe(true)

        const answersByTestId = await answerService.find(null, null, null, 1)
        expect(Object.keys(answersByTestId[0])).toEqual(answersKeys)
        expect(answersByQuestionId.map(a => a.test_id).every(id => id === 1)).toBe(true)


        expect(answerService.find(null, -1)).rejects.toThrowError()
        expect(answerService.find(null, null, -1)).rejects.toThrowError()
        expect(answerService.find(null, null, null, -1)).rejects.toThrowError()

    })

    it('can add test answers', async () => {

        const result = await answerService.add(answersToFirstTest)
        const firstTestResults = result[0]
        delete firstTestResults.date
        expect(firstTestResults).toEqual(testResults)

        expect(answerService.add({})).rejects.toThrowError()

    })

})