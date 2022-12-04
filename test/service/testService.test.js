const TestService = require('./../../src/service/testService')
const { exc } = require("../../src/utils/applicationException")

describe('Test service', () => {

    const testService = new TestService()

    const testForm = {
        test_name: 'test_7',
        groups: [1],
        start_time: '1669909358',
        end_time: '1669912956',
        questions: [
            {
                question: 'Yes?',
                answers: ['yes', 'no'],
                correct_answer_idx: [0]
            }
        ]
    }
    const testFormKeys = Object.keys(testForm)
    const singleTestResponseKeys = ['id', 'test_name', 'groups', 'start_time', 'end_time']

    const convertOutputToInputForm = (testResult) => {
        const addedTest = testResult[0]
        delete addedTest.id
        addedTest.questions.forEach(q => {
            delete q.test_id
            delete q.id
        });
        return addedTest
    }

    it('can find tests', async () => {

        const testFromId = await testService.find('1')
        expect(Object.keys(testFromId)).toEqual(singleTestResponseKeys)

        const fullTestFromId = await testService.find(2, true)
        const fullTestFromIdInput = convertOutputToInputForm(fullTestFromId)
        expect(Object.keys(fullTestFromIdInput)).toEqual(testFormKeys)

        const testPage = await testService.findAll(1, 3)
        expect(testPage).toHaveLength(3)
        expect(Object.keys(testPage[0])).toEqual(singleTestResponseKeys)

        const testNamePage = await testService.findAll(1, 3, 'test')
        expect(testNamePage).toHaveLength(3)
        testNamePage.forEach(test => {
            expect(test.test_name).toContain('test')
        })

        const testFromId_fail = await testService.find(-1).catch(x => x)
        expect(testFromId_fail).toBeInstanceOf(exc)

        const fullTest_fail = await testService.find(null, 'test').catch(x => x)
        expect(fullTest_fail).toBeInstanceOf(exc)

        const testPage_fail = await testService.find(1, -1, null).catch(x => x)
        expect(testPage_fail).toBeInstanceOf(exc)

    })

    it('can add test', async () => {
        const result = await testService.add(testForm).catch(x => x)
        const addedTest = convertOutputToInputForm(result)
        expect(addedTest).toEqual(testForm)

        const wrongInputObject = {
            test_name: 'test',
            some_wrong_column_name: 123,
            groups: [0, 1]
        }
        const result_fail = await testService.add(wrongInputObject).catch(x => x)
        expect(result_fail).toBeInstanceOf(exc)
    })

})