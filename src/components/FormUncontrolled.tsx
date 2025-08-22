import { useRef, useState } from 'react';
import { validatePasswordStrength } from '../utils/passwordStrength';

type Props = {
  onClose: () => void;
};

type Errors = {
  [key: string]: string;
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

  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};

    const name = nameRef.current?.value.trim() || '';
    const age = Number(ageRef.current?.value);
    const email = emailRef.current?.value.trim() || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';
    const gender = genderRef.current?.value || '';
    const terms = termsRef.current?.checked || false;
    const image = imageRef.current?.files?.[0];
    const country = countryRef.current?.value.trim() || '';

    if (!/^[A-ZА-Я]/.test(name)) {
      newErrors.name = 'The name must start with a capital letter';
    }

    if (isNaN(age) || age < 0) {
      newErrors.age = 'Age must be a positive number';
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Incorrect email';
    }

    if (password !== confirmPassword) {
      newErrors.password = 'Passwords must match';
    }
    const passwordIssues = validatePasswordStrength(password);
    if (passwordIssues.length) {
      newErrors.password = passwordIssues.join(', ');
    }

    if (!gender) {
      newErrors.gender = 'Choose gender';
    }

    if (!terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    if (!image) {
      newErrors.image = 'Upload image';
    } else if (!['image/png', 'image/jpeg'].includes(image.type)) {
      newErrors.image = 'Only PNG and JPEG are accepted';
    } else if (image.size > 2 * 1024 * 1024) {
      newErrors.image = 'File is too big (max 2MB)';
    }

    if (!country) {
      newErrors.country = 'Enter country';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const formData = {
          name,
          age,
          email,
          password,
          gender,
          terms,
          image: reader.result,
          country,
        };
        console.log('Form submitted:', formData);
        alert('Form sent successfully!');
        onClose();
      };
      if (image) reader.readAsDataURL(image);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Name:</label>
        <input id="name" ref={nameRef} />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div className="form-row">
        <label htmlFor="age">Age:</label>
        <input id="age" type="number" ref={ageRef} />
        {errors.age && <p className="error">{errors.age}</p>}
      </div>
      <div className="form-row">
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" ref={emailRef} />
        {errors.email && <p className="error">{errors.email}</p>}
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
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="gender">Gender:</label>
        <select id="gender" ref={genderRef}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p className="error">{errors.gender}</p>}
      </div>
      <div className="form-row">
        <label htmlFor="terms">Accept Terms:</label>
        <input id="terms" type="checkbox" ref={termsRef} />
        {errors.terms && <p className="error">{errors.terms}</p>}
      </div>
      <div className="form-row">
        <label htmlFor="image-upload">Upload image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg"
          ref={imageRef}
        />
        {errors.image && <p className="error">{errors.image}</p>}
      </div>
      <div className="form-row">
        <label htmlFor="country">Country:</label>
        <input id="country" type="text" ref={countryRef} />
        {errors.country && <p className="error">{errors.country}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
