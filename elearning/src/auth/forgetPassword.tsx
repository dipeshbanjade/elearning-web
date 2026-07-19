export default function ForgetPassword() {
  return (
    <div className="container mt-5">
      <div className="col col-4 mx-auto">
        <h2 className="col col-md-6 mx-auto mb-5">eLearning</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input type="email" id="email" className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
