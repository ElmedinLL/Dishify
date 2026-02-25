import MenuItemTable from "../menuItem/MenuItemTable"
import { useGetMenuItemQuery } from "../../store/api/menuItemApi"
import MenuItemModel from "./MenuItemModel";

export default function MenuItemManagement() {

const {
  data : menuItems=[],
  error,
  isLoading,
  
} = useGetMenuItemQuery();
console.log(menuItems);



  return (
    <div>
     <div className="container-fluid p-4 mx-3">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Menu Item Management</h2>
              <p className="text-muted mb-0">
                Manage your restaurant's menu items
              </p>
            </div>
            <button className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Add Menu Item
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body"><MenuItemTable
            menuItems={menuItems} error={error} isLoading={isLoading}
            /></div>
          </div>
        </div>
      </div>
<MenuItemModel/>
    </div>
    </div>
  )
}
