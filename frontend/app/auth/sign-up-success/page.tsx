export default function CheckEmailPage() {
  return (
    <div className="flex mt-12 items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Thank you for signing up!</h1>
        <p>
          We sent you a verification link.
          <br />
          Please check your email to confirm your account before signing in.
        </p>
      </div>
    </div>
  );
}
