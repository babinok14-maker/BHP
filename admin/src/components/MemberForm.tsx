import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema, MemberFormSchemaValues } from "../schemas/memberSchema";

interface Props {
  defaultValues?: MemberFormSchemaValues;
  onSubmit: (values: MemberFormSchemaValues) => Promise<void>;
  submitLabel: string;
}

export default function MemberForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormSchemaValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("fullName")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Passport Number</label>
        <input
          {...register("passportNumber")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        />
        {errors.passportNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.passportNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Job Position</label>
        <input
          {...register("jobPosition")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        />
        {errors.jobPosition && (
          <p className="mt-1 text-xs text-red-600">{errors.jobPosition.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          {...register("age", { valueAsNumber: true })}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        />
        {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register("status")}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-approved focus:outline-none"
        >
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-approved px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
