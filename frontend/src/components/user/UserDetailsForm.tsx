import { Form, useActionData, useLoaderData } from "react-router-dom";
import "../../css/FormDetails.css";
import { UserActionResult, UserData } from "../../service/users-service";

type Props = {};

const UserDetailsForm = (props: Props) => {
  let { errors, values } = (useActionData() || {
    errors: undefined,
    values: undefined,
  }) as UserActionResult;
  const loadedUser = useLoaderData() as UserData;
  let user = values || loadedUser;
  return (
    <Form method="PUT" className="restaurant-details-form">
      <label>
        User id:{" "}
        <input name="id" defaultValue={user._id} disabled type="text" />
      </label>
      <label>
        First name:{" "}
        <input name="firstName" defaultValue={user.firstName} type="text" />
      </label>
      <label>
        Last name:{" "}
        <input name="lastName" defaultValue={user.lastName} type="text" />
      </label>
      <label>
        Username :{" "}
        <input name="username" defaultValue={user.username} type="text" />
        {errors?.username && <span className="error">{errors.username}</span>}
      </label>
      <label>
        Email : <input name="email" defaultValue={user.email} type="text" />
        {errors?.email && <span className="error">{errors.email}</span>}
      </label>
      <input name="password" defaultValue={user.password} type="hidden"></input>
      <label>
        Gender :{" "}
        <select
          className="select-special"
          name="gender"
          defaultValue={user.gender}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      <label>
        Image url: <input name="image" defaultValue={user.image} type="text" />
      </label>
      <label>
        Email: <input name="email" defaultValue={user.email} type="text" />
        {errors?.bio && <span className="error">{errors.bio}</span>}
      </label>
      {/* <label>
        Status :{" "}
        <select name="status" defaultValue={user.status}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </label>
      <input
        name="registerDate"
        defaultValue={user.registerDate}
        type="hidden"
      ></input>
      <input
        name="latestModification"
        defaultValue={new Date().toLocaleString("en-GB")}
        type="hidden"
      ></input> */}

      <button type="submit">Submit</button>
      {errors?.conclude && <span className="error">{errors.conclude}</span>}
    </Form>
  );
};

export default UserDetailsForm;
