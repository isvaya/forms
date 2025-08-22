import { useForm } from 'react-hook-form';

type Props = {
  onClose: () => void;
};

type FormData = {
  name: string;
};

export default function HookForm({ onClose }: Props) {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    alert(`Name: ${data.name}`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name:</label>
      <input id="name" {...register('name')} />
      <button type="submit">Submit</button>
    </form>
  );
}
