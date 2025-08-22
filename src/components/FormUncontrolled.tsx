import { useRef } from 'react';

type Props = {
  onClose: () => void;
};

export default function UncontrolledForm({ onClose }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value,
      age: ageRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      confirmPassword: confirmPasswordRef.current?.value,
      gender: genderRef.current?.value,
      terms: termsRef.current?.checked,
      image: imageRef.current?.files?.[0]?.name,
      country: countryRef.current?.value,
    };

    console.log(formData);
    alert(JSON.stringify(formData, null, 2));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Name:</label>
        <input id="name" ref={nameRef} />
      </div>
      <div className="form-row">
        <label htmlFor="age">Age:</label>
        <input id="age" type="number" ref={ageRef} />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" ref={emailRef} />
      </div>
      <div className="form-row">
        <div className="password-row">
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" ref={passwordRef} />
        </div>
        <div className="password-row">
          <label htmlFor="confirm-password">Confirm password:</label>
          <input
            id="confirm-password"
            type="password"
            ref={confirmPasswordRef}
          />
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="gender">Gender:</label>
        <select id="gender" ref={genderRef}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="terms">Accept Terms:</label>
        <input id="terms" type="checkbox" ref={termsRef} />
      </div>
      <div className="form-row">
        <label htmlFor="image-upload">Upload image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg"
          ref={imageRef}
        />
      </div>
      <div className="form-row">
        <label htmlFor="country">Country:</label>
        <input id="country" type="text" ref={countryRef} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
