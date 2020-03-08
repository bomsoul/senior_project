import React, { Component } from 'react';
import QRCode from 'qrcode-react';

class AddCode extends Component {
    
      render() {
        return (
            <div className="container">

                <div className="text-center">
                    <br/>
                    <h2>Scan this QRCode to Enter Classroom</h2>
                    <QRCode size="128" value={"https://seniorproject59.herokuapp.com/addstudent/"+this.props.match.params.classid}/>
                </div>
            </div>
        )
    }
}    
export default AddCode;