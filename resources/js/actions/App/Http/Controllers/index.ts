import Api from './Api'
import TelemetryController from './TelemetryController'
import AlertController from './AlertController'
import TechnicianController from './TechnicianController'
import AdminController from './AdminController'
import DeviceController from './DeviceController'
import Settings from './Settings'


const Controllers = {
    Api: Object.assign(Api, Api),
    TelemetryController: Object.assign(TelemetryController, TelemetryController),
    AlertController: Object.assign(AlertController, AlertController),
    TechnicianController: Object.assign(TechnicianController, TechnicianController),
    AdminController: Object.assign(AdminController, AdminController),
    DeviceController: Object.assign(DeviceController, DeviceController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers