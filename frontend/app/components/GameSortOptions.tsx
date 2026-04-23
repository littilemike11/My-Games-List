/* SORTING
    Rating
    Title
    Release date
    rating count
    */
const GameSortOptions = () => {
  return (
    <>
      <div className="grid grid-cols-10 border-b-2">
        <p className="col-start-4">Title</p>
        <p className="col-start-9">Rating</p>
        <p>Date</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="border-b-2 border-white">
              <th></th>
              <th>Title</th>
              <th>Rating</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GameSortOptions;
