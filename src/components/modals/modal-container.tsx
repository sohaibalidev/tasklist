import React from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
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
            <Pressable style={styles.overlayTouchable} onPress={handleClose} />

            <KeyboardAvoidingView
                behavior={'height'}
                style={styles.keyboardAvoidWrapper}
                keyboardVerticalOffset={0}
            >
                <View style={styles.modalContent}>
                    <ScrollView
                        contentContainerStyle={[styles.scrollContent, { flexGrow: 0 }]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
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
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlayTouchable: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...StyleSheet.absoluteFillObject,
    },
    keyboardAvoidWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
});
