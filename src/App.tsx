import React from "react";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Trivia from "./components/Trivia";
import Footer from "./components/Footer";
import { Col, Select, Slider } from 'antd';
const { Option } = Select;

export const App: React.FC = () => {
  const [isNew, setIsNew] = React.useState(true);
  const [apiSettings, setApiSettings] = React.useState({
    category: 22,
    quantity: 10,
  })

  const apiURL = `https://opentdb.com/api.php?amount=${apiSettings.quantity}&category=${apiSettings.category}&difficulty=medium&type=multiple`

  function isReady() {
    setIsNew(false);
  }

  function apiQuantity(value: number) {
    setApiSettings(prev => ({
      ...prev,
      quantity: value,
    }));
  }  
  
  function apiCategory(value: number) {
    setApiSettings(prev => ({
      ...prev,
      category: value,
    }));
  }

  const tipContent = (value: number) => {
    return `# of Questions: ${value}`
  }

  return (
    <div className="container">
      <Header />
      
      {isNew && (
        <div>
          <Welcome />
          {/* <div className="category-choice"> */}
          <div className="category-choice">
          <Col span={100}>
            <Select 
            id="category" 
            onChange={apiCategory} 
            placeholder="Select a category"
            >
              <Option value="20">Mythology</Option>
              <Option value="22">Geography</Option>
              <Option value="21">Sports</Option>
              <Option value="23">History</Option>
              <Option value="28">Vehicles</Option>
            </Select>
            </Col>
            <Col span={30}>
            <Slider 
            min={3} 
            max={15} 
            defaultValue={5} 
            tooltipVisible 
            tooltipPlacement="bottom" 
            tipFormatter={tipContent} 
            onChange={apiQuantity}
            />
            </Col>
          </div>
          <div className="button-box">
            <div className="button" onClick={isReady}>
              I'm ready!
            </div>
          </div>
        </div>
      )}

      {isNew === false 
      && <Trivia categoryChoice={apiURL} />}

      <Footer />
    </div>
  );
}

export default App