import { useRef } from "react";
import { QuestionMarkInverseMajor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const AccordionItem = ({ faq, active, onToggle }) => {
  const { question, answer } = faq;

  const contentEl = useRef();

  return (

    <li className={`accordion_item ${active ? "active" : ""}`}>
      <button className="button" onClick={onToggle}>
        <Icon source={QuestionMarkInverseMajor} />
        {question}
        <span className="control">{active ? "—" : "+"} </span>
      </button>
      <div
        ref={contentEl}
        className="answer_wrapper"
        style={
          active
            ? { height: contentEl.current.scrollHeight }
            : { height: "0px" }
        }
      >
        <div className="answer">
          <p dangerouslySetInnerHTML={{__html: (answer).replaceAll("\n","<br>")}} />
        </div>
      </div>
    </li>
  );
};

export default AccordionItem;
