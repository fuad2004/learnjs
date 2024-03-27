import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { Link } from 'react-router-dom';

const Task = ({ id, taskText, displayParam }) => {
  return (
    <div
      style={{ display: displayParam ? '' : 'none' }}
      className="relative grid h-[400px] w-full grid-rows-[min-content_1fr] rounded-md border border-solid border-zinc-100/10 bg-zinc-900 p-6">
      <div className="mb-2 text-xl font-semibold text-blue-500">TASK #{id}</div>
      <div className="customScrollBar h-full overflow-auto text-base font-normal text-white">
        <BlocksRenderer
          content={taskText}
          blocks={{
            // You can use the default components to set class names...
            paragraph: ({ children }) => <p className="text-white">{children}</p>,
            // ...or point to a design system
            heading: ({ children, level }) => {
              switch (level) {
                case 1:
                  return <h1>{children}</h1>;
                case 2:
                  return <h2>{children}</h2>;
                case 3:
                  return <h3>{children}</h3>;
                case 4:
                  return <h4>{children}</h4>;
                case 5:
                  return <h5>{children}</h5>;
                case 6:
                  return <h6>{children}</h6>;
                default:
                  return <h1>{children}</h1>;
              }
            },
            // For links, you may want to use the component from your router or framework
            link: ({ children, url }) => <Link to={url}>{children}</Link>,
          }}
          modifiers={{
            bold: ({ children }) => <strong>{children}</strong>,
            italic: ({ children }) => <span className="italic">{children}</span>,
          }}
        />
      </div>
    </div>
  );
};

export default Task;
