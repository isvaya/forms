import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from '../validation/formYup';
import type { FormValues } from '../validation/formYup';
import { useFormStore } from '../store/useFormStore';
import type { FormData } from '../store/useFormStore';

type Props = {
  onClose: () => void;
};

export default function HookForm({ onClose }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit = (values: FormValues) => {
    const file = values.image?.[0];

    const saveData = (base64?: string) => {
      const data: FormData = {
        name: values.name,
        age: values.age,
        email: values.email,
        password: values.password,
        gender: values.gender,
        terms: values.terms,
        country: values.country,
        image: base64,
      };
      addSubmission(data);
      onClose();
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => saveData(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      saveData();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <label htmlFor="name">Name:</label>
        <input id="name" {...register('name')} />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="age">Age:</label>
        <input id="age" type="number" {...register('age')} />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="password">Password:</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="confirmPassword">Repeat password:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="gender">Gender:</label>
        <select id="gender" {...register('gender')}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p className="error">{errors.gender.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="terms">Accept Terms:</label>
        <input id="terms" type="checkbox" {...register('terms')} />
        {errors.terms && <p className="error">{errors.terms.message}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="image">Upload image:</label>
        <input
          id="image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
        {errors.image && (
          <p className="error">{errors.image.message as string}</p>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="country">Country:</label>
        <input id="country" type="text" {...register('country')} />
        {errors.country && <p className="error">{errors.country.message}</p>}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
