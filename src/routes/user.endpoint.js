const UserController = require("../controller/userController")
const UserService = require('../service/userService')

exports.userRoutes = (router, authorize) => {

    const userService = new UserService()
    const userController = new UserController(userService)

    userService.insertGroupsToDatabase()

    // Users
    router.route('/users/authenticate')
        .post(authorize.user, userController.validate('authenticate'), userController.authenticate)

    router.route('/users/find')
        .get(authorize.user, userController.validate('find'), userController.find)

    router.route('/users/delete')
        .delete(authorize.access_admin_panel, userController.validate('delete'), userController.delete)

    // Groups
    router.route('/users/permissions/find')
        .get(authorize.user, userController.validate('findUserPermissions'), userController.findUserPermissions)

    router.route('/users/groups/find')
        .get(authorize.user, userController.validate('findUserGroups'), userController.findUserGroups)

    router.route('/users/groups/find-all')
        .get(authorize.user, userController.validate('findAllGroups'), userController.findAllGroups)

    router.route('/users/groups/edit')
        .put(authorize.manage_permissions, userController.validate('editGroupsPermissions'), userController.editGroupsPermissions)
    
}