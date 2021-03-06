import type { NextPage } from 'next';
import type { Project, UsersOnProject } from '@prisma/client';
import router from 'next/router';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

import type AuthPageProps from '../../types/auth-page-props';
import type { SuccessResponse } from '../../types/response';
import Layout from '../../components/layout';
import ProjectCard from '../../components/project-card';
import Dialog from '../../components/dialog';
import NewProjectForm from '../../components/new-project-form';
import withAuth from '../../utils/with-auth';
import ErrorBox from '../../components/error-box';
import Button from '../../components/button';
import AddButton from '../../components/add-button';

export const getServerSideProps = withAuth();

interface ProjectsProps extends AuthPageProps {}

type Result = SuccessResponse<{
  projects: (UsersOnProject & { project: Project })[];
}>;

const Projects: NextPage<ProjectsProps> = ({ user }) => {
  const { data, error } = useSWR<Result>('/api/projects');
  const [showNewDialog, setShowNewDialog] = useState(false);

  return (
    <Layout title="Projects" user={user}>
      <main className="container mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">
          Projects
          <AddButton
            onClick={() => setShowNewDialog(true)}
            hint="Add new project"
          />
        </h1>

        <AnimatePresence>
          {showNewDialog && (
            <Dialog
              onDismiss={() => setShowNewDialog(false)}
              aria-labelledby="Add new project"
            >
              <h3 className="text-lg font-semibold mb-4">New Project</h3>

              <NewProjectForm
                onDone={(project) => router.push(`/projects/${project.id}`)}
              />
            </Dialog>
          )}
        </AnimatePresence>

        {error ? (
          <ErrorBox>{error.info?.message || 'Something went wrong'}</ErrorBox>
        ) : data && data.data.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {data?.data.projects.map((project) => (
              <ProjectCard project={project} key={project.project.id} />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl italic text-gray-500 mb-3">
              You don&apos;t have any projects yet
            </h3>

            <Button
              onClick={() => setShowNewDialog(true)}
              className="bg-green-200 hover:bg-green-300 text-green-600"
            >
              Add Your First Project
            </Button>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Projects;
