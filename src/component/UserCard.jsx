export const UserCard = ({ user }) => {
  return (
    <div className="user--card">
      <img src={user.avatar_url} alt="" />
      <div>
        <p>UserName: {user.login}</p>
        <a href={user.html_url} target="_blank">
          Github profile url
        </a>
      </div>
    </div>
  );
};
