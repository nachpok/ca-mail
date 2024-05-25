import { IoRefreshOutline } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";


export function MailListHeader() {
    return (
        <div className="mail-list-header">

            <div className=".mail-details-btn-no-hover">
                <input type='checkbox' />
            </div>
            <div className="mail-details-btn">
                <IoRefreshOutline />
            </div>
            <div className="mail-details-btn">
                <IoMdMore />
            </div>
        </div>
    )
}

