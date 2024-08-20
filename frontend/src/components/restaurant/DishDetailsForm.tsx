import { Form, useActionData, useLoaderData } from "react-router-dom";

import "../../css/Restaurant.css";
import { DishActionResult, DishData } from "../../service/dishes-services";

type Props = {};

const DishDetailsForm = (props: Props) => {
  let { errors, values } = (useActionData() || {
    errors: undefined,
    values: undefined,
  }) as DishActionResult;
  const loadedDish = useLoaderData() as DishData;
  let dish = values || loadedDish;

  return (
    <Form method="PUT" className="restaurant-details-form">
      <label>
        Name: <input name="name" defaultValue={dish.name} type="text" />
      </label>
      <input
        name="restaurant_id"
        defaultValue={dish.restaurant_id}
        type="text"
        hidden={true}
      />
      <label>
        Image url: <input name="image" defaultValue={dish.image} type="url" />
      </label>
      <label>
        Description:{" "}
        <input name="description" defaultValue={dish.description} type="text" />
      </label>
      <label>
        Price: <input name="price" defaultValue={dish.price} type="number" />
      </label>
      <label>
        Estimated Time:{" "}
        <input
          name="estimated_time"
          defaultValue={dish.estimated_time}
          type="number"
        />
      </label>
      <button type="submit">Submit</button>
    </Form>
  );
};

export default DishDetailsForm;
