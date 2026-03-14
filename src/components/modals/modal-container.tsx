import React from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useModal } from '../../context/modal-context';
import { useProjects } from '../../hooks/use-project';
import { useTasks } from '../../hooks/use-tasks';
import { TaskForm } from '../task/task-form';
import { ProjectForm } from '../project/project-form';
import { COLORS } from '../../constants/colors';

export const ModalContainer = () => {
    const { activeModal, modalData, closeModal } = useModal();
    const { projects, createProject, updateProject } = useProjects();
    const { createTask, updateTask } = useTasks();

    const handleCreateTask = async (data: any) => {
        await createTask({
            ...data,
            status: 'todo',
        });
        closeModal();
    };

    const handleUpdateTask = async (data: any) => {
        await updateTask({
            id: modalData.id,
            ...data,
        });
        closeModal();
    };

    const handleCreateProject = async (data: any) => {
        await createProject(data);
        closeModal();
    };

    const handleUpdateProject = async (data: any) => {
        await updateProject({
            id: modalData.id,
            ...data,
        });
        closeModal();
    };

    const handleClose = () => {
        closeModal();
    };

    if (!activeModal) return null;

    return (
        <Modal
            visible={activeModal !== null}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable
                    style={styles.overlayTouchable}
                    onPress={handleClose}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContentWrapper}
                >
                    <Pressable
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        {activeModal === 'create-task' && (
                            <TaskForm
                                onClose={handleClose}
                                onSubmit={handleCreateTask}
                                projects={projects}
                                selectedProjectId={modalData?.projectId}
                            />
                        )}

                        {activeModal === 'edit-task' && modalData && (
                            <TaskForm
                                onClose={handleClose}
                                onSubmit={handleUpdateTask}
                                projects={projects}
                                initialData={modalData}
                                isEditing={true}
                            />
                        )}

                        {activeModal === 'create-project' && (
                            <ProjectForm
                                onClose={handleClose}
                                onSubmit={handleCreateProject}
                            />
                        )}

                        {activeModal === 'edit-project' && modalData && (
                            <ProjectForm
                                onClose={handleClose}
                                onSubmit={handleUpdateProject}
                                initialData={modalData}
                                isEditing={true}
                            />
                        )}
                    </Pressable>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    overlayTouchable: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1, 
    },
    modalContentWrapper: {
        position: 'absolute', 
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    modalContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
});