import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteAuthData, getAuthData, isLoggedIn } from '@/utils/apiHandlers';
const UpiCard = () => {
  const [UpiList, setUpiList] = useState([]);
  const islogin = isLoggedIn();
  useEffect(() => {
    getUpiList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUpiList = async () => {
    if (islogin) {
      try {
        const response = await getAuthData('/user/get-userupi');
        if (response?.status === 201 || response?.status === 200) {
          setUpiList(response.data); // Return the data instead of logging it
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  };
  const handleDeleteClick = async (id) => {
    const response = await deleteAuthData(`/user/delete-userapi/${id}`);
    if (response?.status === 200 || response?.status === 201) {
      toast.success('Account Delete Successfully');
      getUpiList();
    } else {
      toast.error(response?.data || 'Something went wrong');
    }
  };
  return (
    <>
      {UpiList &&
        UpiList.map((items, index) => {
          return (
            <div
              key={index}
              className="xl:w-[550px] h-[200px]  bg-gradient-to-br from-[#00000080] to-[#00000040] p-5 pl-4 rounded-[5px] relative"
            >
              {index === 0 ? (
                <div className="absolute top-4 left-0 w-[200px] p-[8px_12px] bg-gradient-1 rounded-tr-md rounded-br-md">
                  <h4 className="font-semibold text-18">Default UPI</h4>
                </div>
              ) : (
                <div className="absolute top-4 left-0 w-[200px] p-[8px_12px] bg-gradient-1 rounded-tr-md rounded-br-md">
                  <h4 className="font-semibold text-18">UPI</h4>
                </div>
              )}
              <div className="flex items-center justify-end">
                {/* <div
                className="w-8 h-8 rounded-[4px] bg-[#505050] grid place-content-center cursor-pointer"
                onClick={() =>
                  navigate('/profile/bank-details/edit-bank-account-details')
                }
              >
                {reactIcons.pen}
              </div> */}
                <div
                  onClick={() => handleDeleteClick(items?.id)}
                  className="ml-3 w-8 h-8 rounded-[4px] bg-[#505050] grid place-content-center cursor-pointer"
                >
                  {reactIcons.delete}
                </div>
              </div>
              <div className="mt-5">
                {/* <h4 className="font-semibold text-22 text-[#82CFFF] mb-2">
                Krishnapal patel
              </h4> */}
                <div className="flex items-start gap-3">
                  <img src="/images/icons/upi.svg" className=" mt-[2px]" />
                  {/* <span className="text-20 mt-[2px]">{reactIcons.bank}</span> */}
                  <div>
                    <h6 className="text-16 font-semibold">
                      UPI Details
                      {/* {items?.accountType === 'bankaccount'
                        ? 'Bank Account'
                        : 'Bank Account'} */}
                    </h6>
                    <h6 className="text-16 font-semibold">
                      UPI Address : {items?.upiId}
                    </h6>
                    <h6 className="text-16 font-semibold">
                      UPI Holder Name : {items?.acountholdername}
                    </h6>
                    <h6 className="text-16 font-semibold">
                      Mobile No : {items?.phonenumber}
                    </h6>
                    {/* <h6 className="text-16 font-semibold">
                      IFSC : {items?.ifscCode}
                    </h6> */}
                    {/* <h6 className="text-16 font-semibold">ROADSANAWAD NIMAR451111</h6> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default UpiCard;
