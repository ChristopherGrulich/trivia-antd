import React from "react";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Trivia from "./components/Trivia";
import Footer from "./components/Footer";
import { Col, Row, Select, Slider } from 'antd';
const { Option } = Select;

export const App: React.FC = () => {
  const [isNew, setIsNew] = React.useState(true);
  const [apiUrl, setApiUrl] = React.useState(
    "https://opentdb.com/api.php?amount=5&category=20&difficulty=medium&type=multiple"
    );

  function isReady() {
    setIsNew(false);
  }

  function apiSetup(value: number) {
    setApiUrl(
      `https://opentdb.com/api.php?amount=5&category=${value}&difficulty=medium&type=multiple`
    );
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
          <div className="category-choice">

            <Select 
            id="category" 
            onChange={apiSetup} 
            placeholder="Select a category"
            >
              <Option value="20">Mythology</Option>
              <Option value="22">Geography</Option>
              <Option value="21">Sports</Option>
              <Option value="23">History</Option>
              <Option value="28">Vehicles</Option>
            </Select>

            <Col span={8}>
            <Slider min={3} max={15} defaultValue={5} tooltipVisible tooltipPlacement="bottom" tipFormatter={tipContent} />
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
      && <Trivia categoryChoice={apiUrl} />}

      <Footer />
    </div>
  );
}

export default App