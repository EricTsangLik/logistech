'use client';

import React, { ChangeEvent } from 'react'
import { useState, useEffect } from 'react'
import { useSession} from "next-auth/react";
import { useRouter } from 'next/navigation'
import convert from 'convert';
import Orderstat from '@components/Orderstat';
import Devicestat from '@components/Devicestat';
import tableHeader from '@components/tableHeader';
import tableBody from '@components/tableBody';
import { packageProgressState } from '@type/progressState';
  

function OrderComponents (  { params }: { params: { stat_title: string, stat_value: any, stat_desc: any } }){
    return React.createElement(Orderstat, {
        params: {...params}
    });
}

function DeviceComponents(  { params }: { params: { stat_title: string, stat_value: any, stat_desc: any } }){
    return React.createElement(Devicestat, {
        params: {...params}
    });
}

const page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const dimensionUnitOptions = [
        {value: "mm", text: 'mm'},
        {value: 'cm', text: 'cm'},
        {value: 'm', text: 'm'},
    ]
    const [dimensionUnit, setdimensionUnit] = useState<String>(dimensionUnitOptions[0].value);

    const weightUnitOptions = [
        {value: "g", text: 'g'},
        {value: 'kg', text: 'kg'},
    ]
    const [weightUnit, setweightUnit] = useState<String>(weightUnitOptions[0].value);
    const currentdata = {
        order_id: "testing1234",
        device_id: "testing",
        length: 3000,
        width: 2000,
        height: 1000,
        weight: 4000,
    };
    const dimensionHeader = ["length", "width", "height"];
    const devicedata = {
        DBStatus: false,
        socketIO: false,
        deviceStatus: true,
    }
    const historyHeader = ["","id",""];
    const historydata = [{
        _id: "test",
        device_id: "testing",
        weight: 4000,
        height: 1000,
        width: 2000,
        length: 3000,
        createAt: Date(),
        status: "final",
    },
    {
        _id: "test",
        device_id: "testing",
        weight: 4000,
        height: 1000,
        width: 2000,
        length: 3000,
        createAt: Date(),
        status: "init",
    }];

    useEffect(() => {

    }, []);
    return (
        <div className='flex w-full max-h-screen flex-col lg:flex-row'>
            <div className="grid flex-auto card rounded-box place-items-center stats stats-vertical shadow text-primary-content">
                {Object.keys(currentdata).map(block => Orderstat({
                    stat_title: block, 
                    stat_value: currentdata[block], 
                    stat_desc: ["length", "width", "height"].includes(block) ? dimensionUnit : ["weight"].includes(block) ? weightUnit : ""
                    }))}
            </div>
            <div className='divider divider-vertical lg:divider-horizontal'></div>
            <div className='grid flex flex-grow w-2/3 card rounded-box place-items-center'>
                <div className='stats stats-horizontal shadow text-primary-content w-full'>
                {Object.keys(devicedata).map(block => Devicestat({stat_title: block, stat_value: devicedata[block]?(
                        <div className='badge badge-primary badge-md'></div>
                    ):(
                        <>
                            <span className="loading loading-ring loading-md"></span>
                        </> 
                    )
                    , stat_desc: devicedata[block] ? "ready" : "waiting"}))}
                </div>
                {/* <div className='divider'></div> */}
                <div className='overflow-x-auto'>
                    <table className='table'>
                        <thead>
                            <tr>
                                {tableHeader(historydata)}
                            </tr>
                        </thead>
                        <tbody>
                            {tableBody(historydata.map( obj => { 
                                obj.status = <div className="radial-progress" style={{"--value":packageProgressState[obj.status]}}>{packageProgressState[obj.status]}% {obj.status}</div>;
                                return obj;
                                }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )
}

export default page
