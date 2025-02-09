<div className="text-sm flex items-center">
  {topBtns?.map((item, index) => (
    <button
      key={index}
      className=" top-buttons  btn-skew font-bold py-2 px-2  rounded mr-2 hidden md:flex justify-center "
    >
      <span className="btn-skew-reverse">{item?.name}</span>
    </button>
  ))}
</div>;

const topBtns = [
  {
    name: 'CASINO',
    path: '/casino',
  },
  {
    name: 'INSTANT GAMES',
    path: '/casino',
  },
  {
    name: 'HOT GAMES',
    path: '/casino',
  },
  {
    name: 'SPORTS',
    path: '/casino',
  },
  {
    name: 'BONUS',
    path: '/casino',
  },
];
