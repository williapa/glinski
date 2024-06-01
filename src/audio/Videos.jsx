export default function Videos() {
  return (
    <>
      <video style={{ display: 'none' }} id="22s" width="480" height="360" controls>
        <source src="22s.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video style={{ display: 'none' }} id="chickens" width="480" height="360" controls>
        <source src="chickens.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video style={{ display: 'none' }} id="dirtygirl" width="480" height="360" controls>
        <source src="dirtyGirl.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video style={{ display: 'none' }} id="dowork" width="480" height="360" controls>
        <source src="doWork.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video style={{ display: 'none' }} id="timetravel" width="480" height="360" controls>
        <source src="timetravel.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};
