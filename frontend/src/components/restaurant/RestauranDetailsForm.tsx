import { Form, useActionData, useLoaderData } from "react-router-dom";
import {
  RestaurantActionResult,
  RestaurantData,
} from "../../service/restaurant-services";
import "../../css/Restaurant.css";

type Props = {};

const RestauranDetailsForm = (props: Props) => {
  let { errors, values } = (useActionData() || {
    errors: undefined,
    values: undefined,
  }) as RestaurantActionResult;
  const loadedRestaurant = useLoaderData() as RestaurantData;
  let restaurant = values || loadedRestaurant;

  return (
    <Form method="PUT" className="restaurant-details-form">
      <label>
        User id:{" "}
        <input name="id" defaultValue={restaurant._id} disabled type="text" />
      </label>
      <label>
        Name: <input name="name" defaultValue={restaurant.name} type="text" />
      </label>
      <label>
        Address:{" "}
        <input name="address" defaultValue={restaurant.address} type="text" />
      </label>
      <label>
        Description:{" "}
        <input
          name="description"
          defaultValue={restaurant.description}
          type="text"
        />
      </label>
      <label>
        Image url:{" "}
        <input name="image" defaultValue={restaurant.image} type="url" />
      </label>
      <button type="submit">Submit</button>
    </Form>
  );
};

export default RestauranDetailsForm;
