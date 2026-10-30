import IotDataController from './IotDataController'
import DashboardController from './DashboardController'


const Api = {
    IotDataController: Object.assign(IotDataController, IotDataController),
    DashboardController: Object.assign(DashboardController, DashboardController),
}

export default Api