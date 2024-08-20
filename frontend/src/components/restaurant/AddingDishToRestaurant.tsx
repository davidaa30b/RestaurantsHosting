import { Form } from "react-router-dom";
import "../../css/Restaurant.css";

type Props = {};

const AddingDishToRestaurant = (props: Props) => {
  return (
    <Form method="POST" className="restaurant-details-form">
      <label>
        Name : <input name="name" type="text" />
      </label>
      <label>
        Image Url : <input name="image" type="url" />
      </label>
      <label>
        Description : <input name="description" type="text" />
      </label>

      <label>
        Price : <input name="price" type="number" />
      </label>
      <label>
        Estimated Time : <input name="estimated_time" type="number" />
      </label>
      <button type="submit">Submit</button>
    </Form>
  );
};

export default AddingDishToRestaurant;
