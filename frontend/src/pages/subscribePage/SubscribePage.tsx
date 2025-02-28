import GetSubscribe from "../../components/getSubscribe/GetSubscribe";
import Subscribe from "../../components/subscribe/Subscribe";
import Unsubscribe from "../../components/unsubscribe/Unsubscribe";

const SubscribePage = () => {
  return (
    <section>
      <div
        style={{
          width: "85%",
          margin: "0 auto",
          padding: "0 1rem",
          marginTop: "4rem",
        }}
      >
        <GetSubscribe />
        <Subscribe />
        <Unsubscribe />
      </div>
    </section>
  );
};

export default SubscribePage;
